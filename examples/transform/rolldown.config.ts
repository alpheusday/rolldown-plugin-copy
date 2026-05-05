import { defineConfig } from "rolldown";
import { copy } from "rolldown-plugin-copy";

export default defineConfig({
    input: "./src/index.ts",
    output: {
        cleanDir: true,
    },
    plugins: [
        copy({
            targets: [
                {
                    src: "./public/**/*",
                    dest: "./dist/public",
                    transform: ({ content }): string => {
                        return content
                            .toString("utf8")
                            .replaceAll("file", "not a file");
                    },
                },
            ],
        }),
    ],
});
