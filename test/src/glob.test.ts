import type { Options } from "rolldown-plugin-copy";

import type { TestProject } from "./@types/project";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { describe, expect, test } from "vitest";

import { runRolldownBuild } from "./bundlers/rolldown";
import { createTestProject, removeTestProject } from "./fixtures/project";

describe("glob targets", (): void => {
    test("copies explicit directory targets recursively", async (): Promise<void> => {
        const project: TestProject =
            await createTestProject("explicit-directory");
        const copiedLogo: string = Path.join(
            project.assetsDir,
            "static",
            "logo.svg",
        );
        const copiedReadme: string = Path.join(
            project.assetsDir,
            "static",
            "nested",
            "readme.txt",
        );
        const options: Options = {
            cwd: project.root,
            targets: [
                {
                    src: "assets/static",
                    dest: project.assetsDir,
                },
            ],
        };

        try {
            await runRolldownBuild(project, options);

            await expect(Fsp.readFile(copiedLogo, "utf8")).resolves.toBe(
                "<svg />\n",
            );
            await expect(Fsp.readFile(copiedReadme, "utf8")).resolves.toBe(
                "nested asset\n",
            );
        } finally {
            await removeTestProject(project);
        }
    });

    test("excludes negated glob targets", async (): Promise<void> => {
        const project: TestProject = await createTestProject("negated-glob");
        const copiedLogo: string = Path.join(project.assetsDir, "logo.svg");
        const copiedReadme: string = Path.join(project.assetsDir, "readme.txt");
        const options: Options = {
            cwd: project.root,
            flatten: true,
            targets: [
                {
                    src: [
                        "assets/static/**/*",
                        "!assets/static/nested/**",
                    ],
                    dest: project.assetsDir,
                },
            ],
        };

        try {
            await runRolldownBuild(project, options);

            await expect(Fsp.readFile(copiedLogo, "utf8")).resolves.toBe(
                "<svg />\n",
            );

            await expect(Fsp.access(copiedReadme)).rejects.toThrow();
        } finally {
            await removeTestProject(project);
        }
    });
});
