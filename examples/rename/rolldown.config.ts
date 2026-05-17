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
                    rename: ({ name, extension }): string => {
                        return `${name}.copied.${extension}`;
                    },
                },
            ],
            verbose: true,
        }),
    ],
});
