import type { writeFile } from "node:fs/promises";

import type { Format, Partial } from "ts-vista";

type WriteFileData = Parameters<typeof writeFile>[1];

type TargetRename = string | ((name: string, extension: string) => string);

type TargetTransform =
    | WriteFileData
    | ((
          contents: Buffer,
          name: string,
      ) => Promise<WriteFileData> | WriteFileData);

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
    rename: TargetRename;
    /**
     * Modify file contents.
     */
    transform: TargetTransform;
};

type Target = Format<Partial<CompleteTarget, "rename" | "transform">>;

export type {
    CompleteTarget,
    Target,
    TargetRename,
    TargetTransform,
    WriteFileData,
};
