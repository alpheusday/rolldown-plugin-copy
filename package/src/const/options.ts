import type { CompleteOptions } from "#/@types/options";

const OPTIONS_DEFAULT = {
    hook: "buildEnd",
    targets: [],
    verbose: false,
} as const satisfies CompleteOptions;

export { OPTIONS_DEFAULT };
