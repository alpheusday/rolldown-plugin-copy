import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

import { fdir as Fdir } from "fdir";

type ResolveSourcePathsOptions = {
    cwd: string;
    sources: string[];
};

const isGlobSource = (source: string): boolean =>
    source.startsWith("!") ||
    source.includes("*") ||
    source.includes("?") ||
    source.includes("[") ||
    source.includes("{");

const normalizeGlobSource = (cwd: string, source: string): string => {
    const negated: boolean = source.startsWith("!");

    const path: string = negated ? source.slice(1) : source;

    const pattern: string = Path.isAbsolute(path)
        ? Path.relative(cwd, path)
        : path;

    return negated ? `!${pattern}` : pattern;
};

const resolveExplicitSourcePath = async (
    cwd: string,
    source: string,
): Promise<string[]> => {
    const path: string = Path.resolve(cwd, source);

    try {
        await Fsp.stat(path);

        return [
            path,
        ];
    } catch {
        return [];
    }
};

const resolveGlobSourcePaths = async (
    cwd: string,
    sources: string[],
): Promise<string[]> => {
    const patterns: string[] = [];

    for (let i: number = 0; i < sources.length; i++) {
        const source: string | undefined = sources[i];

        if (source === void 0) continue;

        patterns.push(normalizeGlobSource(cwd, source));
    }

    const relativePaths: string[] = await new Fdir()
        .withRelativePaths()
        .glob(...patterns)
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

const resolveSourcePaths = async ({
    cwd,
    sources,
}: ResolveSourcePathsOptions): Promise<string[]> => {
    const paths: string[] = [];
    const globSources: string[] = [];

    for (let i: number = 0; i < sources.length; i++) {
        const source: string | undefined = sources[i];

        if (source === void 0) continue;

        if (isGlobSource(source)) {
            globSources.push(source);
            continue;
        }

        paths.push(...(await resolveExplicitSourcePath(cwd, source)));
    }

    if (globSources.length > 0) {
        paths.push(...(await resolveGlobSourcePaths(cwd, globSources)));
    }

    return paths;
};

export type { ResolveSourcePathsOptions };
export { resolveSourcePaths };
