import type { CopyEvent, Options } from "rolldown-plugin-copy";

import { describe, expect, test } from "vitest";

import { runRolldownBuild } from "./bundlers/rolldown";
import { createTestProject, removeTestProject } from "./fixtures/project";

describe("onCopy listener", (): void => {
    test("receives events for each copied item", async (): Promise<void> => {
        const project = await createTestProject("oncopy-basic");
        const events: CopyEvent[] = [];
        const options: Options = {
            cwd: project.root,
            flatten: true,
            targets: [
                {
                    src: "assets/index.html",
                    dest: project.assetsDir,
                    rename: "index.copied.html",
                    transform: ({ content }): string =>
                        content
                            .toString("utf8")
                            .replace("__SCRIPT__", "main.js"),
                },
                {
                    src: [
                        "assets/static/logo.svg",
                        "assets/static/nested/readme.txt",
                    ],
                    dest: [
                        project.assetsDir,
                        project.mirrorDir,
                    ],
                },
            ],
            onCopy: (event: CopyEvent): void => {
                events.push(event);
            },
        };

        try {
            await runRolldownBuild(project, options);

            expect(events.length).toBeGreaterThanOrEqual(1);

            const renamedEvent: CopyEvent | undefined = events.find(
                (e: CopyEvent): boolean => e.target.renamed,
            );
            expect(renamedEvent).toBeDefined();
            expect(renamedEvent?.target.src).toContain("index.html");
            expect(renamedEvent?.target.dest).toContain("index.copied.html");
            expect(renamedEvent?.target.transformed).toBe(true);

            const transformedEvent: CopyEvent | undefined = events.find(
                (e: CopyEvent): boolean => e.target.transformed,
            );
            expect(transformedEvent).toBeDefined();

            for (const event of events) {
                expect(event.target).toHaveProperty("src");
                expect(event.target).toHaveProperty("dest");
                expect(typeof event.target.renamed).toBe("boolean");
                expect(typeof event.target.transformed).toBe("boolean");
            }
        } finally {
            await removeTestProject(project);
        }
    });

    test("fires without verbose enabled", async (): Promise<void> => {
        const project = await createTestProject("oncopy-no-verbose");
        const events: CopyEvent[] = [];
        const options: Options = {
            cwd: project.root,
            flatten: true,
            targets: [
                {
                    src: "assets/static/logo.svg",
                    dest: project.assetsDir,
                },
            ],
            onCopy: (event: CopyEvent): void => {
                events.push(event);
            },
        };

        try {
            await runRolldownBuild(project, options);

            expect(events.length).toBe(1);
            expect(events[0].target.src).toContain("logo.svg");
            expect(events[0].target.dest).toContain("logo.svg");
            expect(events[0].target.renamed).toBe(false);
            expect(events[0].target.transformed).toBe(false);
        } finally {
            await removeTestProject(project);
        }
    });

    test("works alongside verbose", async (): Promise<void> => {
        const project = await createTestProject("oncopy-verbose");
        const events: CopyEvent[] = [];
        const options: Options = {
            cwd: project.root,
            flatten: true,
            targets: [
                {
                    src: "assets/static/logo.svg",
                    dest: project.assetsDir,
                },
            ],
            onCopy: (event: CopyEvent): void => {
                events.push(event);
            },
        };

        try {
            await runRolldownBuild(project, options);

            expect(events.length).toBe(1);
            expect(events[0].target.src).toContain("logo.svg");
        } finally {
            await removeTestProject(project);
        }
    });

    test("does not fire when there are no targets", async (): Promise<void> => {
        const project = await createTestProject("oncopy-no-targets");
        const events: CopyEvent[] = [];
        const options: Options = {
            cwd: project.root,
            targets: [],
            onCopy: (event: CopyEvent): void => {
                events.push(event);
            },
        };

        try {
            await runRolldownBuild(project, options);

            expect(events.length).toBe(0);
        } finally {
            await removeTestProject(project);
        }
    });
});
