import type { BenchPlugin } from "#/@types/plugin";

const runGenerateBundle = async (plugin: BenchPlugin): Promise<void> => {
    if (plugin.generateBundle === void 0) {
        throw new Error("Copy plugin did not expose a generateBundle hook.");
    }

    await plugin.generateBundle();
};

export { runGenerateBundle };
