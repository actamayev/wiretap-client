import WiretapHttpClient from "../classes/wiretap-http-client"

export abstract class BaseDataService {
	protected readonly httpClient: WiretapHttpClient
	protected readonly pathHeader: EndpointHeaders

	constructor(httpClient: WiretapHttpClient, pathHeader: EndpointHeaders) {
		this.httpClient = httpClient
		this.pathHeader = pathHeader
	}

	// You can add common methods here that all services might need
	protected buildUrl(endpoint: string): string {
		return `${this.pathHeader}${endpoint}`
	}
}
