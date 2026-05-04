import type { BenchPlugin } from "#/@types/plugin";
import type { BenchProject } from "#/@types/project";

import { copy as createRolldownCopy } from "rolldown-plugin-copy";
import { default as createRollupCopy } from "rollup-plugin-copy";
import { afterAll, beforeAll, bench, describe } from "vitest";

import { BENCH_OPTIONS } from "#/const/options";
import { createBenchProject, removeBenchProject } from "#/fixtures/project";
import {
    createRolldownCopyOptions,
    createRollupCopyOptions,
} from "#/options/copy";
import { runBuildEnd } from "#/plugins/build-end";

let project: BenchProject | undefined;

const getProject = (): BenchProject => {
    if (project === void 0) {
        throw new Error("Benchmark project has not been created.");
    }

    return project;
};

beforeAll(async (): Promise<void> => {
    project = await createBenchProject();
});

afterAll(async (): Promise<void> => {
    const currentProject: BenchProject | undefined = project;

    if (currentProject === void 0) return void 0;

    await removeBenchProject(currentProject);
});

describe("copy", (): void => {
    bench(
        "rolldown-plugin-copy",
        async (): Promise<void> => {
            const benchProject: BenchProject = getProject();

            const plugin: BenchPlugin = createRolldownCopy(
                createRolldownCopyOptions(benchProject),
            ) as unknown as BenchPlugin;

            await runBuildEnd(plugin);
        },
        BENCH_OPTIONS,
    );

    bench(
        "rollup-plugin-copy",
        async (): Promise<void> => {
            const benchProject: BenchProject = getProject();

            const plugin: BenchPlugin = createRollupCopy(
                createRollupCopyOptions(benchProject),
            ) as unknown as BenchPlugin;

            await runBuildEnd(plugin);
        },
        BENCH_OPTIONS,
    );
});
