import type * as Fs from "node:fs";

import type { CopyTargetKind } from "#/@types/event";
import type { Target, WriteFileData } from "#/@types/target";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { renameTarget } from "./rename";

type ResolveDestDirOptions = {
    cwd: string;
    src: string;
    dest: string;
    flatten: boolean;
};

const resolveDestDir = ({
    cwd,
    src,
    dest,
    flatten,
}: ResolveDestDirOptions): string => {
    if (flatten) return dest;

    const relativeDir: string = Path.dirname(Path.relative(cwd, src));

    if (relativeDir === ".") return dest;

    const relativeDirParts: string[] = relativeDir.split(Path.sep);

    return Path.join(dest, ...relativeDirParts.slice(1));
};

type GenerateTargetsOptions = {
    cwd: string;
    src: string;
    target: Target;
    flatten: boolean;
};

type GeneratedTarget = {
    kind: CopyTargetKind;
    src: string;
    dest: string;
    renamed: boolean;
    transformed: boolean;
    content?: WriteFileData;
};

const generateTargets = async ({
    cwd,
    src,
    target,
    flatten,
}: GenerateTargetsOptions): Promise<GeneratedTarget[]> => {
    const stats: Fs.Stats = await Fsp.stat(src);

    if (target.transform && stats.isDirectory()) return [];

    const parsed = Path.parse(src);

    const destinations =
        typeof target.dest === "string"
            ? [
                  target.dest,
              ]
            : target.dest;

    const result: GeneratedTarget[] = [];

    for (let i: number = 0; i < destinations.length; i++) {
        const dest: string | undefined = destinations[i];

        if (dest === void 0) continue;

        const destDir: string = resolveDestDir({
            cwd,
            src,
            dest,
            flatten,
        });

        const destPath: string = target.rename
            ? renameTarget({
                  path: src,
                  fileName: parsed.base,
                  rename: target.rename,
              })
            : parsed.base;

        result.push({
            kind: stats.isFile() ? "file" : "directory",
            src,
            dest: Path.join(destDir, destPath),
            renamed: Boolean(target.rename),
            transformed: Boolean(target.transform),
            ...(target.transform && {
                content:
                    typeof target.transform === "function"
                        ? await target.transform({
                              fileName: parsed.base,
                              content: await Fsp.readFile(src),
                          })
                        : target.transform,
            }),
        });
    }

    return result;
};

export type { GeneratedTarget, GenerateTargetsOptions };
export { generateTargets };
