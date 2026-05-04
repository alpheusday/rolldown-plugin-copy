import type { PluginOption } from "vite";

import type { TestProject } from "#/@types/project";

import { copy } from "rolldown-plugin-copy";
import { build } from "vite";

import { createCopyOptions } from "#/options/copy";

const runViteBuild = async (project: TestProject): Promise<void> => {
    const plugin: PluginOption = copy(
        createCopyOptions(project, "writeBundle"),
    ) as unknown as PluginOption;

    await build({
        root: project.root,
        configFile: false,
        logLevel: "silent",
        plugins: [
            plugin,
        ],
        build: {
            outDir: project.outDir,
            emptyOutDir: true,
            rollupOptions: {
                input: project.input,
                output: {
                    entryFileNames: "[name].js",
                    chunkFileNames: "chunks/[name].js",
                },
            },
        },
    });
};

export { runViteBuild };
