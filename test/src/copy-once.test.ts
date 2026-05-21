import type { Options } from "rolldown-plugin-copy";

import type { TestProject } from "./@types/project";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { rolldown } from "rolldown";
import { copy } from "rolldown-plugin-copy";
import { describe, expect, test } from "vitest";

import { createTestProject, removeTestProject } from "./fixtures/project";

const runRolldownBuildWithPlugin = async (
    project: TestProject,
    plugin: ReturnType<typeof copy>,
): Promise<void> => {
    const bundle = await rolldown({
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

describe("copyOnce option", (): void => {
    test("copies files only on the first build", async (): Promise<void> => {
        const project = await createTestProject("copyonce-basic");
        const copiedLogo: string = Path.join(project.assetsDir, "logo.svg");
        const options: Options = {
            cwd: project.root,
            copyOnce: true,
            flatten: true,
            targets: [
                {
                    src: "assets/static/logo.svg",
                    dest: project.assetsDir,
                },
            ],
        };

        const plugin: ReturnType<typeof copy> = copy(options);

        try {
            await runRolldownBuildWithPlugin(project, plugin);

            await expect(Fsp.readFile(copiedLogo, "utf8")).resolves.toBe(
                "<svg />\n",
            );

            await Fsp.rm(copiedLogo);

            await runRolldownBuildWithPlugin(project, plugin);

            await expect(Fsp.access(copiedLogo)).rejects.toThrow();
        } finally {
            await removeTestProject(project);
        }
    });

    test("copies files on every build when copyOnce is false", async (): Promise<void> => {
        const project = await createTestProject("copyonce-false");
        const copiedLogo: string = Path.join(project.assetsDir, "logo.svg");
        const options: Options = {
            cwd: project.root,
            copyOnce: false,
            flatten: true,
            targets: [
                {
                    src: "assets/static/logo.svg",
                    dest: project.assetsDir,
                },
            ],
        };

        const plugin: ReturnType<typeof copy> = copy(options);

        try {
            await runRolldownBuildWithPlugin(project, plugin);

            await expect(Fsp.readFile(copiedLogo, "utf8")).resolves.toBe(
                "<svg />\n",
            );

            await Fsp.rm(copiedLogo);

            await runRolldownBuildWithPlugin(project, plugin);

            await expect(Fsp.readFile(copiedLogo, "utf8")).resolves.toBe(
                "<svg />\n",
            );
        } finally {
            await removeTestProject(project);
        }
    });
});
