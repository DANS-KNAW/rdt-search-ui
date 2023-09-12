#!/bin/bash

rm -rf build

npx esbuild \
    src/index.tsx \
    src/facets/list/view/index.tsx \
    src/facets/map/view/index.tsx \
    src/facets/chart/view/date.tsx \
    src/facets/chart/view/pie.tsx \
    --external:react \
    --external:styled-components \
    --bundle \
    --sourcemap \
    --outdir=build \
    --format=esm \
    --watch
