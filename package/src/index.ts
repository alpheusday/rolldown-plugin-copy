import { copy } from "#/plugins/copy";

export default copy;

export type {
    CopyEvent,
    CopyEventListener,
    CopyTargetKind,
} from "#/@types/event";
export type { Options } from "#/@types/options";
export type {
    Target,
    TargetRename,
    TargetRenameOptions,
    TargetTransform,
    TargetTransformOptions,
    WriteFileData,
} from "#/@types/target";

export { copy } from "#/plugins/copy";
