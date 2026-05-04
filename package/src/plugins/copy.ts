import type { Plugin } from "rolldown";

import type { CompleteOptions, Options } from "#/@types/options";

import { toMerged } from "es-toolkit";

import { OPTIONS_DEFAULT } from "#/const/options";
import { name, version } from "../../package.json";

const copy = (options?: Options): Plugin => {
    const opts: CompleteOptions = toMerged(OPTIONS_DEFAULT, options ?? {});

    return {
        name,
        version,
        [opts.hook]: async () => {},
    };
};

export { copy };
