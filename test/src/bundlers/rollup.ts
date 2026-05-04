import type { Plugin, RollupBuild } from "rollup";

import type { TestProject } from "#/@types/project";

import { copy } from "rolldown-plugin-copy";
import { rollup } from "rollup";

import { createCopyOptions } from "#/options/copy";

const runRollupBuild = async (project: TestProject): Promise<void> => {
    const plugin: Plugin = copy(
        createCopyOptions(project),
    ) as unknown as Plugin;

    const bundle: RollupBuild = await rollup({
        input: project.input,
        plugins: [
            plugin,
        ],
    });

    try {
        await bundle.write({
            dir: project.outDir,
            format: "esm",
            entryFileNames: "[name].js",
            chunkFileNames: "chunks/[name].js",
        });
    } finally {
        await bundle.close();
    }
};

export { runRollupBuild };
