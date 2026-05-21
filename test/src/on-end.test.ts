import type { CopyEndEvent, Options } from "rolldown-plugin-copy";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { describe, expect, test } from "vitest";

import { runRolldownBuild } from "./bundlers/rolldown";
import { createTestProject, removeTestProject } from "./fixtures/project";

describe("onEnd listener", (): void => {
    test("fires after all copies with no error", async (): Promise<void> => {
        const project = await createTestProject("onend-success");
        const events: CopyEndEvent[] = [];
        const options: Options = {
            cwd: project.root,
            flatten: true,
            targets: [
                {
                    src: "assets/static/logo.svg",
                    dest: project.assetsDir,
                },
                {
                    src: "assets/static/nested/readme.txt",
                    dest: project.assetsDir,
                },
            ],
            onEnd: (event: CopyEndEvent): void => {
                events.push(event);
            },
        };

        try {
            await runRolldownBuild(project, options);

            expect(events.length).toBe(1);
            expect(events[0].cwd).toBe(project.root);
            expect(events[0].error).toBeUndefined();
        } finally {
            await removeTestProject(project);
        }
    });

    test("fires with no error when there are no targets", async (): Promise<void> => {
        const project = await createTestProject("onend-no-targets");
        const events: CopyEndEvent[] = [];
        const options: Options = {
            cwd: project.root,
            targets: [],
            onEnd: (event: CopyEndEvent): void => {
                events.push(event);
            },
        };

        try {
            await runRolldownBuild(project, options);

            expect(events.length).toBe(1);
            expect(events[0].cwd).toBe(project.root);
            expect(events[0].error).toBeUndefined();
        } finally {
            await removeTestProject(project);
        }
    });

    test("fires with error and re-throws when a copy fails", async (): Promise<void> => {
        const project = await createTestProject("onend-error");
        const events: CopyEndEvent[] = [];

        const copiedLogo: string = Path.join(project.assetsDir, "logo.svg");

        // Create a directory at the destination file path to cause copyFile to fail
        await Fsp.mkdir(project.assetsDir, {
            recursive: true,
        });
        await Fsp.mkdir(copiedLogo);

        const options: Options = {
            cwd: project.root,
            flatten: true,
            targets: [
                {
                    src: "assets/static/logo.svg",
                    dest: project.assetsDir,
                },
            ],
            onEnd: (event: CopyEndEvent): void => {
                events.push(event);
            },
        };

        try {
            await expect(runRolldownBuild(project, options)).rejects.toThrow();

            expect(events.length).toBe(1);
            expect(events[0].cwd).toBe(project.root);
            expect(events[0].error).toBeDefined();
        } finally {
            await removeTestProject(project);
        }
    });
});
