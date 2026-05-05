import type { Options } from "rolldown-plugin-copy";

import type { TestProject } from "./@types/project";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { describe, expect, test } from "vitest";

import { assertCodeSplitOutput, assertCopiedAssets } from "./assertions/build";
import { runRolldownBuild } from "./bundlers/rolldown";
import { runRollupBuild } from "./bundlers/rollup";
import { runViteBuild } from "./bundlers/vite";
import { createTestProject, removeTestProject } from "./fixtures/project";

type BuildCase = {
    name: string;
    run: (project: TestProject) => Promise<void>;
};

const buildCases: BuildCase[] = [
    {
        name: "Rolldown",
        run: runRolldownBuild,
    },
    {
        name: "Rollup",
        run: runRollupBuild,
    },
    {
        name: "Vite",
        run: runViteBuild,
    },
];

describe("programmatic bundler usage", (): void => {
    test.each(
        buildCases,
    )("$name copies files during a code-split build", async ({
        name,
        run,
    }: BuildCase): Promise<void> => {
        const project: TestProject = await createTestProject(
            name.toLowerCase(),
        );

        try {
            await run(project);
            await assertCodeSplitOutput(project);
            await assertCopiedAssets(project);
        } finally {
            await removeTestProject(project);
        }
    });

    test("Rolldown flattens glob targets without recursively copying matched directories", async (): Promise<void> => {
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

    test("Rolldown copies explicit directory targets recursively", async (): Promise<void> => {
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

    test("Rolldown preserves directories for glob targets when flatten is false", async (): Promise<void> => {
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
