import type { AsyncPluginHooks } from "rolldown";
import type { Format, Partial } from "ts-vista";

import type {
    CopyEndEventListener,
    CopyEventListener,
    CopyStartEventListener,
} from "#/@types/event";
import type { Target } from "#/@types/target";

type CompleteOptions = {
    /**
     * Current working directory.
     *
     * By default, it is `process.cwd()`.
     */
    cwd: string;
    /**
     * Rolldown hook the plugin should use.
     *
     * By default, it is `generateBundle`.
     */
    hook: AsyncPluginHooks;
    /**
     * Array of targets to copy.
     *
     * By default, it is `[]`.
     */
    targets: Target[];
    /**
     * Copy items once. Useful in watch mode.
     *
     * By default, it is `false`.
     */
    copyOnce: boolean;
    /**
     * Copy items synchronous.
     *
     * By default, it is `false`.
     */
    copySync: boolean;
    /**
     * Remove the directory structure of copied files.
     *
     * By default, it is `false`.
     */
    flatten: boolean;
    /**
     * Output copied items to console.
     *
     * By default, it is `false`.
     */
    verbose: boolean;
    /**
     * Listener called before any copy begins.
     */
    onStart: CopyStartEventListener | undefined;
    /**
     * Listener for copy events. Called for each copied item.
     */
    onCopy: CopyEventListener | undefined;
    /**
     * Listener called after all copies complete.
     */
    onEnd: CopyEndEventListener | undefined;
};

/**
 * Options for `copy` plugin.
 */
type Options = Format<Partial<CompleteOptions>>;

export type { CompleteOptions, Options };
