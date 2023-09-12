import type { BaseFacetConfig } from '../common/types/search/facets'

export function isConfig(props: { config: BaseFacetConfig } | any): props is { config: BaseFacetConfig } {
    return props.hasOwnProperty('config')
}