import * as Path from "node:path";

import { fdir as Fdir } from "fdir";

type ResolveSourcePathsOptions = {
    cwd: string;
    sources: string[];
};

const resolveSourcePaths = async ({
    cwd,
    sources,
}: ResolveSourcePathsOptions): Promise<string[]> => {
    const relativePaths: string[] = await new Fdir()
        .withRelativePaths()
        .withDirs()
        .glob(...sources)
        .crawl(cwd)
        .withPromise();

    const paths: string[] = [];

    for (let i: number = 0; i < relativePaths.length; i++) {
        const relativePath: string | undefined = relativePaths[i];

        if (relativePath === void 0) continue;

        paths.push(Path.resolve(cwd, relativePath));
    }

    return paths;
};

export type { ResolveSourcePathsOptions };
export { resolveSourcePaths };
