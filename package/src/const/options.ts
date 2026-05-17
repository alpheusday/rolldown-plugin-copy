import type { CompleteOptions } from "#/@types/options";

const OPTIONS_DEFAULT = {
    cwd: process.cwd(),
    hook: "generateBundle",
    targets: [],
    copyOnce: false,
    copySync: false,
    flatten: false,
    verbose: false,
    onStart: void 0,
    onCopy: void 0,
    onEnd: void 0,
} as const satisfies CompleteOptions;

export { OPTIONS_DEFAULT };
