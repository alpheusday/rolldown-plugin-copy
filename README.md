# Rolldown Plugin Copy

A utility to copy files and directories.

Partially compatible with [rollup-plugin-copy](https://github.com/vladshcherbin/rollup-plugin-copy).

## Installation

Install this package as a dependency in the project:

```sh
# npm
npm i rolldown-plugin-copy

# Yarn
yarn add rolldown-plugin-copy

# pnpm
pnpm add rolldown-plugin-copy

# Deno
deno add npm:rolldown-plugin-copy

# Bun
bun add rolldown-plugin-copy
```

## Usage

Add the plugin into the Rolldown config:

```ts
import { defineConfig } from "rolldown";
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

## Contributing

For contributing, please refer to the [contributing guide](./CONTRIBUTING.md).

## Credits

This project is inspired by:

- [rollup-plugin-copy](https://github.com/vladshcherbin/rollup-plugin-copy), created by [Vlad Shcherbin](https://github.com/vladshcherbin).

## License

This project is licensed under the terms of the MIT license.
