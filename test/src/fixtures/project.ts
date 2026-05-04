import type { TestProject } from "#/@types/project";

import * as Fsp from "node:fs/promises";
import * as Os from "node:os";
import * as Path from "node:path";

const createTestProject = async (name: string): Promise<TestProject> => {
    const root: string = await Fsp.mkdtemp(
        Path.join(Os.tmpdir(), `rolldown-plugin-copy-${name}-`),
    );
    const srcDir: string = Path.join(root, "src");
    const assetsSourceDir: string = Path.join(root, "assets");
    const staticDir: string = Path.join(assetsSourceDir, "static");
    const nestedDir: string = Path.join(staticDir, "nested");
    const outDir: string = Path.join(root, "dist");
    const assetsDir: string = Path.join(outDir, "public");
    const mirrorDir: string = Path.join(outDir, "mirror");
    const input: string = Path.join(srcDir, "main.js");
    const mainSource: string = [
        'export const entry = "entry";',
        'void import("./lazy.js").then(({ lazy }) => console.log(lazy));',
        "",
    ].join("\n");
    const lazySource: string = [
        'export const lazy = "lazy";',
        "",
    ].join("\n");
    const htmlSource: string = [
        "<!doctype html>",
        '<script type="module" src="__SCRIPT__"></script>',
        "",
    ].join("\n");

    await Promise.all([
        Fsp.mkdir(srcDir, {
            recursive: true,
        }),
        Fsp.mkdir(nestedDir, {
            recursive: true,
        }),
    ]);

    await Promise.all([
        Fsp.writeFile(input, mainSource),
        Fsp.writeFile(Path.join(srcDir, "lazy.js"), lazySource),
        Fsp.writeFile(Path.join(assetsSourceDir, "index.html"), htmlSource),
        Fsp.writeFile(Path.join(staticDir, "logo.svg"), "<svg />\n"),
        Fsp.writeFile(Path.join(nestedDir, "readme.txt"), "nested asset\n"),
    ]);

    return {
        root,
        input,
        outDir,
        assetsDir,
        mirrorDir,
        copiedHtml: Path.join(assetsDir, "index.copied.html"),
        copiedLogo: Path.join(assetsDir, "logo.svg"),
        copiedReadme: Path.join(assetsDir, "readme.txt"),
        mirroredLogo: Path.join(mirrorDir, "logo.svg"),
        mirroredReadme: Path.join(mirrorDir, "readme.txt"),
    };
};

const removeTestProject = async (project: TestProject): Promise<void> => {
    await Fsp.rm(project.root, {
        recursive: true,
        force: true,
    });
};

export { createTestProject, removeTestProject };
