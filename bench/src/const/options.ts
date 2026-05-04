import type { bench } from "vitest";

const ASSET_COUNT: number = 128;

const BENCH_OPTIONS: NonNullable<Parameters<typeof bench>[2]> = {
    iterations: 10,
    time: 1_000,
    warmupIterations: 2,
    warmupTime: 250,
};

export { ASSET_COUNT, BENCH_OPTIONS };
