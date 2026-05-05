# Rolldown Plugin Copy

A utility to copy files and directories.

Partially compatible with [rollup-plugin-copy](https://github.com/vladshcherbin/rollup-plugin-copy).

## Usage

Add the plugin into the Vite config:

```ts
import { defineConfig } from "vite";
import { copy } from "rolldown-plugin-copy";

export default defineConfig({
    plugins: [
        copy({
            targets: [
                {
                    src: "./public/index.html",
                    dest: "./dist/public",
                },
                {
                    src: [
                        "./public/static/css/light.css",
                        "./public/static/css/dark.css",
                    ],
                    dest: "./dist/public/static/css",
                },
                {
                    src: "./public/static/images/**/*",
                    dest: "./dist/public/static/images",
                },
            ],
        }),
    ],
});
```

## License

This project is licensed under the terms of the MIT license.
