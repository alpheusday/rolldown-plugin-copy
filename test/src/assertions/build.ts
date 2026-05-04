import type { TestProject } from "../@types/project";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { expect } from "vitest";

import { listFiles } from "#/assertions/files";

const assertCopiedAssets = async (project: TestProject): Promise<void> => {
    await expect(Fsp.readFile(project.copiedHtml, "utf8")).resolves.toBe(
        [
            "<!doctype html>",
            '<script type="module" src="main.js"></script>',
            "",
        ].join("\n"),
    );
    await expect(Fsp.readFile(project.copiedLogo, "utf8")).resolves.toBe(
        "<svg />\n",
    );
    await expect(Fsp.readFile(project.copiedReadme, "utf8")).resolves.toBe(
        "nested asset\n",
    );
    await expect(Fsp.readFile(project.mirroredLogo, "utf8")).resolves.toBe(
        "<svg />\n",
    );
    await expect(Fsp.readFile(project.mirroredReadme, "utf8")).resolves.toBe(
        "nested asset\n",
    );
};

const assertCodeSplitOutput = async (project: TestProject): Promise<void> => {
    const files: string[] = await listFiles(project.outDir);
    const jsFiles: string[] = files.filter((file: string): boolean =>
        file.endsWith(".js"),
    );
    expect(jsFiles).toContain(Path.join(project.outDir, "main.js"));
    expect(jsFiles.length).toBeGreaterThanOrEqual(2);
};

export { assertCodeSplitOutput, assertCopiedAssets };
