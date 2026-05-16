/**
 * Kind of the copied item.
 */
type CopyTargetKind = "file" | "directory";

/**
 * Event emitted for each copied item.
 */
type CopyEvent = {
    /**
     * Kind of the copied item.
     */
    kind: CopyTargetKind;
    /**
     * Absolute source path of the copied item.
     */
    src: string;
    /**
     * Absolute destination path of the copied item.
     */
    dest: string;
    /**
     * Whether the item was renamed.
     */
    renamed: boolean;
    /**
     * Whether the item was transformed.
     */
    transformed: boolean;
};

/**
 * Listener for copy events.
 */
type CopyEventListener = (event: CopyEvent) => void | Promise<void>;

export type { CopyEvent, CopyEventListener, CopyTargetKind };
