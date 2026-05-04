import type { BenchPlugin } from "#/@types/plugin";

const runBuildEnd = async (plugin: BenchPlugin): Promise<void> => {
    if (plugin.buildEnd === void 0) {
        throw new Error("Copy plugin did not expose a buildEnd hook.");
    }

    await plugin.buildEnd();
};

export { runBuildEnd };
