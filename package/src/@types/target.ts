import type { writeFile } from "node:fs/promises";

import type { Format, Partial } from "ts-vista";

type WriteFileData = Parameters<typeof writeFile>[1];

type TargetRenameOptions = {
    path: string;
    name: string;
    extension: string;
};

type TargetRename = string | ((options: TargetRenameOptions) => string);

type TargetTransformOptions = {
    fileName: string;
    content: Buffer;
};

type TargetTransform =
    | WriteFileData
    | ((
          options: TargetTransformOptions,
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
    TargetRenameOptions,
    TargetTransform,
    TargetTransformOptions,
    WriteFileData,
};
