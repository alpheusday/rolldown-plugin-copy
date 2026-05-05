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

Add the plugin into the Vite config:

```ts
import { defineConfig } from "vite";
import { copy } from "rolldown-plugin-copy";

export default defineConfig({
    plugins: [
        copy({
            targets: [
                {
                    src: "./static/**/*",
                    dest: "./dist/static",
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
