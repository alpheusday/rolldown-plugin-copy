import type {
    CopyEndEventListener,
    CopyEventListener,
    CopyStartEventListener,
} from "#/@types/event";
import type { GeneratedTarget } from "#/functions/generate";

import * as Fs from "node:fs";
import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { log } from "#/configs/log";

const canCopyInParallel = (targets: GeneratedTarget[]): boolean => {
    const destinations: Set<string> = new Set();

    for (let i: number = 0; i < targets.length; i++) {
        const target: GeneratedTarget | undefined = targets[i];

        if (target === void 0) continue;

        /**
         * Raw directory copies write a whole subtree, so exact destination checks
         * cannot detect nested conflicts with other targets in parallel.
         */
        if (target.kind === "directory") return false;

        /**
         * Multiple targets writing the same path leads to conflicts, so
         * keep the original target order by falling back to sequential copies.
         */
        if (destinations.has(target.dest)) return false;

        destinations.add(target.dest);
    }

    return true;
};

const ensureDirSync = (filePath: string): void => {
    Fs.mkdirSync(Path.dirname(filePath), {
        recursive: true,
    });
};

const ensureDirAsync = async (filePath: string): Promise<void> => {
    await Fsp.mkdir(Path.dirname(filePath), {
        recursive: true,
    });
};

type CopyFileOptions = {
    src: string;
    dest: string;
    copySync: boolean;
};

const copyFile = async ({
    src,
    dest,
    copySync,
}: CopyFileOptions): Promise<void> => {
    if (copySync) {
        ensureDirSync(dest);

        Fs.copyFileSync(src, dest);

        return void 0;
    }

    await ensureDirAsync(dest);

    await Fsp.copyFile(src, dest);
};

type CopyDirectoryOptions = {
    src: string;
    dest: string;
    copySync: boolean;
};

const copyDirectory = async ({
    src,
    dest,
    copySync,
}: CopyDirectoryOptions): Promise<void> => {
    if (copySync) {
        Fs.cpSync(src, dest, {
            recursive: true,
        });

        return void 0;
    }

    await Fsp.cp(src, dest, {
        recursive: true,
    });
};

const writeTransformed = async (target: GeneratedTarget): Promise<void> => {
    await ensureDirAsync(target.dest);
    await Fsp.writeFile(target.dest, target.content ?? "");
};

type CopyTargetOptions = {
    target: GeneratedTarget;
    copySync: boolean;
};

const copyTarget = async ({
    target,
    copySync,
}: CopyTargetOptions): Promise<void> => {
    if (target.transformed) {
        return await writeTransformed(target);
    }

    if (target.kind === "file") {
        return await copyFile({
            src: target.src,
            dest: target.dest,
            copySync,
        });
    }

    return await copyDirectory({
        src: target.src,
        dest: target.dest,
        copySync,
    });
};

type BuildLogMessageOptions = {
    cwd: string;
    target: GeneratedTarget;
};

const buildLogMessage = ({ cwd, target }: BuildLogMessageOptions): string => {
    let message: string = `${Path.relative(cwd, target.src)} → ${target.dest}`;

    const flags: string[] = [];

    if (target.renamed) flags.push("R");
    if (target.transformed) flags.push("T");

    if (flags.length > 0) {
        message += ` [${flags.join(",")}]`;
    }

    return message;
};

type EmitCopyOptions = {
    onCopy: CopyEventListener | undefined;
    target: GeneratedTarget;
};

const emitCopy = async ({ onCopy, target }: EmitCopyOptions): Promise<void> => {
    if (onCopy !== void 0) {
        await onCopy({
            target: {
                kind: target.kind,
                src: target.src,
                dest: target.dest,
                renamed: target.renamed,
                transformed: target.transformed,
            },
        });
    }
};

type TryCopyTargetsOptions = {
    cwd: string;
    targets: GeneratedTarget[];
    copySync: boolean;
    verbose: boolean;
    onCopy: CopyEventListener | undefined;
};

const tryCopyTargets = async ({
    cwd,
    targets,
    copySync,
    verbose,
    onCopy,
}: TryCopyTargetsOptions): Promise<void> => {
    if (targets.length === 0) {
        if (verbose) {
            console.log("");
            log.success("no items to copy");
            console.log("");
        }

        return void 0;
    }

    const logs: string[] = [];

    if (!copySync && canCopyInParallel(targets)) {
        const result: string[] = (
            await Promise.all(
                targets.map(
                    async (
                        target: GeneratedTarget,
                    ): Promise<string | undefined> => {
                        await copyTarget({
                            target,
                            copySync,
                        });

                        await emitCopy({
                            onCopy,
                            target,
                        });

                        return verbose
                            ? buildLogMessage({
                                  cwd,
                                  target,
                              })
                            : void 0;
                    },
                ),
            )
        ).filter((item: string | undefined): item is string => item !== void 0);

        if (verbose) {
            for (let i: number = 0; i < result.length; i++) {
                const message: string | undefined = result[i];

                if (message === void 0) continue;

                logs.push(message);
            }
        }
    } else {
        for (let i: number = 0; i < targets.length; i++) {
            const target: GeneratedTarget | undefined = targets[i];

            if (target === void 0) continue;

            await copyTarget({
                target,
                copySync,
            });

            await emitCopy({
                onCopy,
                target,
            });

            if (verbose) {
                logs.push(
                    buildLogMessage({
                        cwd,
                        target,
                    }),
                );
            }
        }
    }

    if (verbose) {
        console.log("");

        for (let i: number = 0; i < logs.length; i++) {
            log.success(logs[i]);
        }

        console.log("");
    }
};

type CopyTargetsOptions = TryCopyTargetsOptions & {
    onStart: CopyStartEventListener | undefined;
    onEnd: CopyEndEventListener | undefined;
};

const copyTargets = async (options: CopyTargetsOptions): Promise<void> => {
    const { onStart, onEnd, targets } = options;

    let error: unknown = void 0;

    try {
        if (onStart !== void 0) {
            await onStart({
                cwd: options.cwd,
                targets,
            });
        }

        await tryCopyTargets(options);
    } catch (err: unknown) {
        error = err;
    } finally {
        if (onEnd !== void 0) {
            await onEnd({
                cwd: options.cwd,
                error,
            });
        }
    }

    if (error !== void 0) throw error;
};

export type { CopyTargetsOptions };
export { copyTargets };
