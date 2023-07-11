# RDT search UI

## Local dev with DANS project
- assuming dir tree:
    - knaw
        - dans
            - dans-wrapper
            - rda-client
            - ohsmart-client
    - rdt-search-ui
- $ npm i --no-save ../knaw/dans/\<client-name\>/node_modules/react ../knaw/dans/\<client-name\>/node_modules/styled-components
or use
- $ ./scripts/link-rda.sh

## TODO
- move facet values to Facet classes. This way we can finegrain the way the values are handled, for example after a reset when the ListFacet values have been set to 'show all', we want to show all the values instead of the initial config.size amount.
- move handling of list facet values to list facet class?
- add full text value to active filters (with full text it is just says: 'clear all' now)