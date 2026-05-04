import type { AsyncPluginHooks } from "rolldown";
import type { Format, Partial } from "ts-vista";

import type { Target } from "#/@types/target";

type CompleteOptions = {
    /**
     * Rolldown hook the plugin should use.
     *
     * By default, it is `buildEnd`.
     */
    hook: AsyncPluginHooks;
    /**
     * Array of targets to copy.
     *
     * By default, it is `[]`.
     */
    targets: Target[];
    /**
     * Output copied items to console.
     *
     * By default, it is `false`.
     */
    verbose: boolean;
};

type Options = Format<Partial<CompleteOptions>>;

export type { CompleteOptions, Options };
