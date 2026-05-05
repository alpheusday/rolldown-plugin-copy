import type { writeFile } from "node:fs/promises";

import type { Format, Partial } from "ts-vista";

/**
 * Write file data.
 */
type WriteFileData = Parameters<typeof writeFile>[1];

/**
 * Rename options.
 */
type TargetRenameOptions = {
    /**
     * The file path.
     *
     * For example, `/home/abc/dev/project/public/static/css/index.css`.
     */
    path: string;
    /**
     * The file name.
     *
     * For example, `index` in `index.css`.
     */
    name: string;
    /**
     * The file extension.
     *
     * For example, `css` in `index.css`.
     */
    extension: string;
};

/**
 * Rename with string or function.
 */
type TargetRename = string | ((options: TargetRenameOptions) => string);

/**
 * Content transform options.
 */
type TargetTransformOptions = {
    /**
     * The file name, such as `index.css`.
     */
    fileName: string;
    /**
     * The file content.
     */
    content: Buffer;
};

/**
 * Content transform with function or string.
 */
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

/**
 * Target type for `copy` plugin.
 */
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
