import type { Target, WriteFileData } from "#/@types/target";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { renameTarget } from "./rename";

type GenerateTargetsOptions = {
    src: string;
    target: Target;
    flatten: boolean;
};

type GeneratedTarget = {
    src: string;
    dest: string;
    renamed: boolean;
    transformed: boolean;
    content?: WriteFileData;
};

const generateTargets = async ({
    src,
    target,
    flatten,
}: GenerateTargetsOptions): Promise<GeneratedTarget[]> => {
    if (target.transform && (await Fsp.stat(src)).isDirectory()) return [];

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

        const destDir: string =
            flatten || !parsed.dir
                ? dest
                : parsed.dir.replace(parsed.dir.split("/").at(0) ?? "", dest);

        const destPath: string = target.rename
            ? renameTarget({
                  path: src,
                  fileName: parsed.base,
                  rename: target.rename,
              })
            : parsed.base;

        result.push({
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
