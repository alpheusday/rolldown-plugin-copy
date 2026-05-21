import type { Options } from "rolldown-plugin-copy";

import type { TestProject } from "./@types/project";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { describe, expect, test } from "vitest";

import { runRolldownBuild } from "./bundlers/rolldown";
import { createTestProject, removeTestProject } from "./fixtures/project";

describe("flatten option", (): void => {
    test("flattens glob targets without recursively copying matched directories", async (): Promise<void> => {
        const project: TestProject = await createTestProject("flatten-glob");
        const copiedReadme: string = Path.join(project.assetsDir, "readme.txt");
        const nestedReadme: string = Path.join(
            project.assetsDir,
            "static",
            "nested",
            "readme.txt",
        );
        const options: Options = {
            cwd: project.root,
            flatten: true,
            targets: [
                {
                    src: "assets/**/*",
                    dest: project.assetsDir,
                },
            ],
        };

        try {
            await runRolldownBuild(project, options);

            await expect(Fsp.readFile(copiedReadme, "utf8")).resolves.toBe(
                "nested asset\n",
            );
            await expect(Fsp.access(nestedReadme)).rejects.toThrow();
        } finally {
            await removeTestProject(project);
        }
    });

    test("preserves directories for glob targets when flatten is false", async (): Promise<void> => {
        const project: TestProject = await createTestProject("flatten-false");
        const copiedReadme: string = Path.join(
            project.assetsDir,
            "static",
            "nested",
            "readme.txt",
        );
        const transformedReadme: string = Path.join(
            project.mirrorDir,
            "static",
            "nested",
            "readme.txt",
        );
        const flattenedReadme: string = Path.join(
            project.assetsDir,
            "readme.txt",
        );
        const transformedFlattenedReadme: string = Path.join(
            project.mirrorDir,
            "readme.txt",
        );
        const options: Options = {
            cwd: project.root,
            flatten: false,
            targets: [
                {
                    src: "assets/**/*",
                    dest: project.assetsDir,
                },
                {
                    src: "assets/**/*",
                    dest: project.mirrorDir,
                    transform: ({ content }): string =>
                        content
                            .toString("utf8")
                            .replace("nested asset", "nested transformed"),
                },
            ],
        };

        try {
            await runRolldownBuild(project, options);

            await expect(Fsp.readFile(copiedReadme, "utf8")).resolves.toBe(
                "nested asset\n",
            );
            await expect(Fsp.readFile(transformedReadme, "utf8")).resolves.toBe(
                "nested transformed\n",
            );
            await expect(Fsp.access(flattenedReadme)).rejects.toThrow();
            await expect(
                Fsp.access(transformedFlattenedReadme),
            ).rejects.toThrow();
        } finally {
            await removeTestProject(project);
        }
    });
});
