import type { ElasticSearchResponse, FSResponse } from '../../../common'

export function ESResponseParser(response: ElasticSearchResponse): FSResponse {
	return {
		results: response.hits.hits
			.map((hit: any): any => ({
				id: hit._id,
				snippets: hit.highlight ? hit.highlight.text : [],
				...hit._source
			})),
		total: response.hits.total?.value || 0,
	}
}
