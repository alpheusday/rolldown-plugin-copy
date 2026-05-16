import type { CopyEvent, Options } from "rolldown-plugin-copy";

import { describe, expect, test } from "vitest";

import { runRolldownBuild } from "./bundlers/rolldown";
import { createTestProject, removeTestProject } from "./fixtures/project";

describe("onCopy listener", (): void => {
    test("receives events for each copied item", async (): Promise<void> => {
        const project = await createTestProject("onlog-basic");
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
                (e: CopyEvent): boolean => e.renamed,
            );
            expect(renamedEvent).toBeDefined();
            expect(renamedEvent?.src).toContain("index.html");
            expect(renamedEvent?.dest).toContain("index.copied.html");
            expect(renamedEvent?.transformed).toBe(true);

            const transformedEvent: CopyEvent | undefined = events.find(
                (e: CopyEvent): boolean => e.transformed,
            );
            expect(transformedEvent).toBeDefined();

            for (const event of events) {
                expect(event).toHaveProperty("src");
                expect(event).toHaveProperty("dest");
                expect(typeof event.renamed).toBe("boolean");
                expect(typeof event.transformed).toBe("boolean");
            }
        } finally {
            await removeTestProject(project);
        }
    });

    test("fires without verbose enabled", async (): Promise<void> => {
        const project = await createTestProject("onlog-no-verbose");
        const events: CopyEvent[] = [];
        const options: Options = {
            cwd: project.root,
            flatten: true,
            verbose: false,
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
            expect(events[0].src).toContain("logo.svg");
            expect(events[0].dest).toContain("logo.svg");
            expect(events[0].renamed).toBe(false);
            expect(events[0].transformed).toBe(false);
        } finally {
            await removeTestProject(project);
        }
    });

    test("works alongside verbose", async (): Promise<void> => {
        const project = await createTestProject("onlog-verbose");
        const events: CopyEvent[] = [];
        const options: Options = {
            cwd: project.root,
            flatten: true,
            verbose: true,
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
            expect(events[0].src).toContain("logo.svg");
        } finally {
            await removeTestProject(project);
        }
    });

    test("does not fire when there are no targets", async (): Promise<void> => {
        const project = await createTestProject("onlog-no-targets");
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
