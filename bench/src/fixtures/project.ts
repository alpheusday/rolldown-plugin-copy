import type { BenchProject } from "#/@types/project";

import * as Fsp from "node:fs/promises";
import * as Os from "node:os";
import * as Path from "node:path";

import { ASSET_COUNT } from "#/const/options";

const createBenchProject = async (): Promise<BenchProject> => {
    const root: string = await Fsp.mkdtemp(
        Path.join(Os.tmpdir(), "rolldown-plugin-copy-bench-"),
    );
    const assetsDir: string = Path.join(root, "assets");
    const staticDir: string = Path.join(assetsDir, "static");
    const rolldownOutDir: string = Path.join(root, "dist", "rolldown");
    const rollupOutDir: string = Path.join(root, "dist", "rollup");

    await Fsp.mkdir(staticDir, {
        recursive: true,
    });

    await Fsp.writeFile(
        Path.join(assetsDir, "index.html"),
        [
            "<!doctype html>",
            '<script type="module" src="__SCRIPT__"></script>',
            "",
        ].join("\n"),
    );

    const writes: Promise<void>[] = [];

    for (let i: number = 0; i < ASSET_COUNT; i++) {
        const id: string = i.toString().padStart(3, "0");

        writes.push(
            Fsp.writeFile(
                Path.join(staticDir, `asset-${id}.txt`),
                `asset ${id}\n`,
            ),
        );
    }

    await Promise.all(writes);

    return {
        root,
        assetsDir,
        rolldownOutDir,
        rollupOutDir,
    };
};

const removeBenchProject = async (
    benchProject: BenchProject,
): Promise<void> => {
    await Fsp.rm(benchProject.root, {
        force: true,
        recursive: true,
    });
};

export { createBenchProject, removeBenchProject };
