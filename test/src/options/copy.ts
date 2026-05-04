import type { Options } from "rolldown-plugin-copy";

import type { TestProject } from "#/@types/project";

type CopyHook = NonNullable<Options["hook"]>;

const createCopyOptions = (project: TestProject, hook?: CopyHook): Options => ({
    cwd: project.root,
    ...(hook && {
        hook,
    }),
    targets: [
        {
            src: "assets/index.html",
            dest: project.assetsDir,
            rename: "index.copied.html",
            transform: ({ content }) =>
                content.toString("utf8").replace("__SCRIPT__", "main.js"),
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
});

export { createCopyOptions };
