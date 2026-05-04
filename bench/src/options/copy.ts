import type { Options as RolldownCopyOptions } from "rolldown-plugin-copy";

import type { RollupCopyOptions } from "#/@types/plugin";
import type { BenchProject } from "#/@types/project";

import * as Path from "node:path";

const createRolldownCopyOptions = (
    benchProject: BenchProject,
): RolldownCopyOptions => ({
    cwd: benchProject.root,
    targets: [
        {
            src: "assets/index.html",
            dest: Path.join(benchProject.rolldownOutDir, "public"),
            rename: "index.copied.html",
            transform: ({ content }) =>
                content.toString("utf8").replace("__SCRIPT__", "main.js"),
        },
        {
            src: "assets/static/**/*.txt",
            dest: [
                Path.join(benchProject.rolldownOutDir, "public"),
                Path.join(benchProject.rolldownOutDir, "mirror"),
            ],
        },
    ],
});

const createRollupCopyOptions = (
    benchProject: BenchProject,
): RollupCopyOptions => ({
    targets: [
        {
            // rollup-plugin-copy matches with cwd but still stats/copies src as-is.
            src: Path.join(benchProject.assetsDir, "index.html"),
            dest: Path.join(benchProject.rollupOutDir, "public"),
            rename: "index.copied.html",
            transform: (contents: Buffer): string =>
                contents.toString("utf8").replace("__SCRIPT__", "main.js"),
        },
        {
            // Absolute sources keep the benchmark compatible with that behavior.
            src: Path.join(benchProject.assetsDir, "static/**/*.txt"),
            dest: [
                Path.join(benchProject.rollupOutDir, "public"),
                Path.join(benchProject.rollupOutDir, "mirror"),
            ],
        },
    ],
});

export { createRolldownCopyOptions, createRollupCopyOptions };
