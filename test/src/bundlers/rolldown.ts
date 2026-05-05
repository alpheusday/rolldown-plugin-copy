import type { RolldownBuild } from "rolldown";
import type { Options } from "rolldown-plugin-copy";

import type { TestProject } from "#/@types/project";

import { rolldown } from "rolldown";
import { copy } from "rolldown-plugin-copy";

import { createCopyOptions } from "#/options/copy";

const runRolldownBuild = async (
    project: TestProject,
    options?: Options,
): Promise<void> => {
    const copyOptions: Options = options ?? createCopyOptions(project);

    const bundle: RolldownBuild = await rolldown({
        input: project.input,
        plugins: [
            copy(copyOptions),
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
