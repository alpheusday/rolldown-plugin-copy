import type { CompleteOptions } from "#/@types/options";

const OPTIONS_DEFAULT = {
    cwd: process.cwd(),
    hook: "generateBundle",
    copyOnce: false,
    copySync: false,
    flatten: false,
    verbose: false,
    targets: [],
} as const satisfies CompleteOptions;

export { OPTIONS_DEFAULT };
