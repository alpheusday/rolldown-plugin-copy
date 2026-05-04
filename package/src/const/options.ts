import type { CompleteOptions } from "#/@types/options";

const OPTIONS_DEFAULT = {
    hook: "buildEnd",
    copyOnce: false,
    copySync: false,
    flatten: true,
    verbose: false,
    targets: [],
} as const satisfies CompleteOptions;

export { OPTIONS_DEFAULT };
