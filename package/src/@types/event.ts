/**
 * Kind of the resolved target.
 */
type ResolvedTargetKind = "file" | "directory";

/**
 * Resolved target.
 */
type ResolvedTarget = {
    /**
     * Kind of the copied item.
     */
    kind: ResolvedTargetKind;
    /**
     * Absolute source path of the target.
     */
    src: string;
    /**
     * Absolute destination path of target.
     */
    dest: string;
    /**
     * Whether the target was renamed.
     */
    renamed: boolean;
    /**
     * Whether the target was transformed.
     */
    transformed: boolean;
};

/**
 * Copy start event.
 */
type CopyStartEvent = {
    /**
     * Current working directory.
     */
    cwd: string;
    /**
     * Resolved targets.
     */
    targets: ResolvedTarget[];
};

/**
 * Listener for copy start event.
 */
type CopyStartEventListener = (event: CopyStartEvent) => void | Promise<void>;

/**
 * Copy event.
 */
type CopyEvent = {
    /**
     * Resolved target.
     */
    target: ResolvedTarget;
};

/**
 * Listener for copy event.
 */
type CopyEventListener = (context: CopyEvent) => void | Promise<void>;

/**
 * Copy end event.
 */
type CopyEndEvent = {
    /**
     * Current working directory.
     */
    cwd: string;
    /**
     * Error when copy failed.
     */
    error?: unknown;
};

/**
 * Listener for copy end event.
 */
type CopyEndEventListener = (context: CopyEndEvent) => void | Promise<void>;

export type {
    CopyEndEvent,
    CopyEndEventListener,
    CopyEvent,
    CopyEventListener,
    CopyStartEvent,
    CopyStartEventListener,
    ResolvedTarget,
    ResolvedTargetKind,
};
