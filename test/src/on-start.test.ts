import type { CopyStartEvent, Options } from "rolldown-plugin-copy";

import { describe, expect, test } from "vitest";

import { runRolldownBuild } from "./bundlers/rolldown";
import { createTestProject, removeTestProject } from "./fixtures/project";

describe("onStart listener", (): void => {
    test("fires before copies with correct targets", async (): Promise<void> => {
        const project = await createTestProject("onstart-targets");
        const events: CopyStartEvent[] = [];
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
            onStart: (event: CopyStartEvent): void => {
                events.push(event);
            },
        };

        try {
            await runRolldownBuild(project, options);

            expect(events.length).toBe(1);
            expect(events[0].cwd).toBe(project.root);
            expect(events[0].targets.length).toBe(2);
        } finally {
            await removeTestProject(project);
        }
    });

    test("fires before onCopy and onEnd", async (): Promise<void> => {
        const project = await createTestProject("onstart-order");
        const order: string[] = [];
        const options: Options = {
            cwd: project.root,
            flatten: true,
            targets: [
                {
                    src: "assets/static/logo.svg",
                    dest: project.assetsDir,
                },
            ],
            onStart: (): void => {
                order.push("start");
            },
            onCopy: (): void => {
                order.push("copy");
            },
            onEnd: (): void => {
                order.push("end");
            },
        };

        try {
            await runRolldownBuild(project, options);

            expect(order).toEqual([
                "start",
                "copy",
                "end",
            ]);
        } finally {
            await removeTestProject(project);
        }
    });

    test("does not fire when there are no targets", async (): Promise<void> => {
        const project = await createTestProject("onstart-no-targets");
        const events: CopyStartEvent[] = [];
        const options: Options = {
            cwd: project.root,
            targets: [],
            onStart: (event: CopyStartEvent): void => {
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
