import type { CompleteOptions } from "#/@types/options";

const OPTIONS_DEFAULT = {
    cwd: process.cwd(),
    hook: "generateBundle",
    copyOnce: false,
    copySync: false,
    flatten: false,
    verbose: false,
    onCopy: void 0,
    targets: [],
} as const satisfies CompleteOptions;

export { OPTIONS_DEFAULT };
