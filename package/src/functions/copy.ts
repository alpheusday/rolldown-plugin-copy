import type { GeneratedTarget } from "#/functions/generate";

import * as Fs from "node:fs";
import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { log } from "#/configs/log";

type CopyTargetsOptions = {
    cwd: string;
    targets: GeneratedTarget[];
    copySync: boolean;
    verbose: boolean;
};

const copyTargets = async ({
    cwd,
    targets,
    copySync,
    verbose,
}: CopyTargetsOptions): Promise<void> => {
    if (targets.length === 0) {
        if (verbose) log.success("no items to copy");
        return void 0;
    }

    const logs: string[] = [];

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
            let message: string = `${Path.relative(cwd, target.src)} → ${target.dest}`;

            const flags: string[] = [];

            if (target.renamed) flags.push("R");

            if (target.transformed) flags.push("T");

            if (flags.length > 0) {
                message += ` [${flags.join(",")}]`;
            }

            logs.push(message);
        }
    }

    if (verbose) {
        for (let i: number = 0; i < logs.length; i++) {
            log.success(logs[i]);
        }

        console.log("");
    }
};

export type { CopyTargetsOptions };
export { copyTargets };
