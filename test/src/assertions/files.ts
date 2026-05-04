import type * as Fs from "node:fs";

import * as Fsp from "node:fs/promises";
import * as Path from "node:path";

const listFiles = async (dir: string): Promise<string[]> => {
    const entries: Fs.Dirent[] = await Fsp.readdir(dir, {
        withFileTypes: true,
    });

    const nestedFiles: string[][] = await Promise.all(
        entries.map(async (entry: Fs.Dirent): Promise<string[]> => {
            const path: string = Path.join(dir, entry.name);

            return entry.isDirectory()
                ? listFiles(path)
                : [
                      path,
                  ];
        }),
    );

    return nestedFiles.flat();
};

export { listFiles };
