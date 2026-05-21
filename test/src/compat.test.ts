import type { TestProject } from "./@types/project";

import { describe, test } from "vitest";

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

describe("bundler compatibility", (): void => {
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
});
