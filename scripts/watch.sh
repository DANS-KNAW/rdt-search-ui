#!/bin/bash

rm -rf build

npx esbuild \
    src/index.tsx \
    src/facets/list/index.ts \
    src/facets/map/index.ts \
    src/facets/histogram/index.ts \
    src/facets/chart/index.ts \
    --external:react \
    --external:styled-components \
    --bundle \
    --sourcemap \
    --outdir=build \
    --format=esm \
    --watch