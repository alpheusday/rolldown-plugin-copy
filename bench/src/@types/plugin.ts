type BenchHook = () => Promise<void> | void;

type BenchPlugin = {
    buildEnd?: BenchHook;
    generateBundle?: BenchHook;
};

type RollupTarget = {
    readonly src: string | readonly string[];
    readonly dest: string | readonly string[];
    readonly rename?: string;
    readonly transform?: (contents: Buffer, name: string) => Buffer | string;
};

type RollupCopyOptions = {
    readonly copyOnce?: boolean;
    readonly copySync?: boolean;
    readonly flatten?: boolean;
    readonly hook?: string;
    readonly targets?: readonly RollupTarget[];
    readonly verbose?: boolean;
};

type RollupCopyFactory = (options?: RollupCopyOptions) => BenchPlugin;

export type { BenchPlugin, RollupCopyFactory, RollupCopyOptions };
