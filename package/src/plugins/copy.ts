import type { Plugin } from "rolldown";

import type { CompleteOptions, Options } from "#/@types/options";
import type { Target } from "#/@types/target";
import type { GeneratedTarget } from "#/functions/generate";

import { toMerged } from "es-toolkit";

import { OPTIONS_DEFAULT } from "#/const/options";
import { copyTargets } from "#/functions/copy";
import { generateTargets } from "#/functions/generate";
import { resolveSourcePaths } from "#/functions/resolve";
import { name, version } from "../../package.json";

/**
 * A utility to copy files and directories.
 *
 * ### Example
 *
 * ```ts
 * import { defineConfig } from "rolldown";
 * import { copy } from "rolldown-plugin-copy";
 *
 * export default defineConfig({
 *     plugins: [
 *         copy({
 *             targets: [
 *                 {
 *                     src: "./public/static/css/index.css",
 *                     dest: "./dist/public/static/css",
 *                 },
 *             ],
 *         }),
 *     ],
 * });
 * ```
 */
const copy = (options?: Options): Plugin => {
    const opts: CompleteOptions = toMerged(OPTIONS_DEFAULT, options ?? {});

    let copied: boolean = false;

    return {
        name,
        version,
        [opts.hook]: async (): Promise<void> => {
            if (opts.copyOnce === true && copied === true) return void 0;

            if (opts.targets.length === 0) return void 0;

            const targets: GeneratedTarget[] = [];

            for (let i: number = 0; i < opts.targets.length; i++) {
                const target: Target | undefined = opts.targets[i];

                if (target === void 0) continue;

                const paths: string[] = await resolveSourcePaths({
                    cwd: opts.cwd,
                    sources:
                        typeof target.src === "string"
                            ? [
                                  target.src,
                              ]
                            : target.src,
                });

                for (let j: number = 0; j < paths.length; j++) {
                    const src: string | undefined = paths[j];

                    if (src === void 0) continue;

                    const tg: GeneratedTarget[] = await generateTargets({
                        cwd: opts.cwd,
                        src,
                        target,
                        flatten: opts.flatten,
                    });

                    targets.push(...tg);
                }
            }

            await copyTargets({
                cwd: opts.cwd,
                targets,
                copySync: opts.copySync,
                verbose: opts.verbose,
                onCopy: opts.onCopy,
            });

            copied = true;
        },
    };
};

export { copy };
