import type { TargetRename } from "#/@types/target";

import * as Path from "node:path";

type RenameTargetOptions = {
    path: string;
    fileName: string;
    rename: TargetRename;
};

const renameTarget = (options: RenameTargetOptions): string => {
    const parsed: Path.ParsedPath = Path.parse(options.fileName);

    return typeof options.rename === "function"
        ? options.rename({
              path: options.path,
              name: parsed.name,
              extension: parsed.ext.replace(".", ""),
          })
        : options.rename;
};

export { renameTarget };
