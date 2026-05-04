import type { GeneratedTarget } from "#/functions/generate";

import * as Fs from "node:fs";
import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { consola } from "consola";

type CopyTargetsOptions = {
    targets: GeneratedTarget[];
    copySync: boolean;
    verbose: boolean;
};

const flagKeys = [
    "renamed",
    "transformed",
];

const copyTargets = async ({
    targets,
    copySync,
    verbose,
}: CopyTargetsOptions): Promise<void> => {
    if (targets.length === 0) {
        if (verbose) consola.warn("no items to copy");
        return void 0;
    }

    if (verbose) {
        consola.info("copied:");
    }

    for (let i: number = 0; i < targets.length; i++) {
        const target: GeneratedTarget | undefined = targets[i];

        if (target === void 0) continue;

        if (target.transformed) {
            await Fsp.mkdir(Path.dirname(target.dest), {
                recursive: true,
            });

            await Fsp.writeFile(target.dest, target.content ?? "");
        } else if (copySync) {
            Fs.cpSync(target.src, target.dest, {
                recursive: true,
            });
        } else {
            await Fsp.cp(target.src, target.dest, {
                recursive: true,
            });
        }

        if (verbose) {
            let message: string = `${target.src} → ${target.dest}`;

            const flags: string[] = Object.entries(target)
                .filter(([key, value]) => flagKeys.includes(key) && value)
                .map(([key]) => key.charAt(0).toUpperCase());

            if (flags.length > 0) {
                message += ` [${flags.join(" ")}]`;
            }

            consola.info(message);
        }
    }
};

export type { CopyTargetsOptions };
export { copyTargets };
