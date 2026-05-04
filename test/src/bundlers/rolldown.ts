import type { RolldownBuild } from "rolldown";

import type { TestProject } from "#/@types/project";

import { rolldown } from "rolldown";
import { copy } from "rolldown-plugin-copy";

import { createCopyOptions } from "#/options/copy";

const runRolldownBuild = async (project: TestProject): Promise<void> => {
    const bundle: RolldownBuild = await rolldown({
        input: project.input,
        plugins: [
            copy(createCopyOptions(project)),
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

export { runRolldownBuild };
