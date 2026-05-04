import type { writeFile } from "node:fs/promises";

import type { Format, Partial } from "ts-vista";

type WriteFileData = Parameters<typeof writeFile>[1];

type CompleteTarget = {
    /**
     * Path or glob of what to copy.
     */
    src: string | string[];
    /**
     * destination(s) to copy.
     */
    dest: string | string[];
    /**
     * Change destination file or directory name.
     */
    rename:
        | string
        | ((name: string, extension: string, fullPath: string) => string);
    /**
     * Modify file contents.
     */
    transform:
        | WriteFileData
        | ((contents: Buffer, name: string) => Promise<WriteFileData>);
};

type Target = Format<Partial<CompleteTarget, "rename" | "transform">>;

export type { CompleteTarget, Target, WriteFileData };
