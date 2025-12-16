import { AxiosResponse } from "axios"
import WiretapHttpClient from "../classes/wiretap-http-client"
import { BaseDataService } from "./base-data-service"

export default class EventsDataService extends BaseDataService {
	constructor(httpClient: WiretapHttpClient, pathHeader: EndpointHeaders) {
		super(httpClient, pathHeader)
	}

	async retrieveAllEvents(offset = 0): Promise<AxiosResponse<AllEventsResponse | ErrorResponse>> {
		const url = offset === 0
			? this.buildUrl("/all-events")
			: this.buildUrl(`/all-events?offset=${offset}`)
		return await this.httpClient.http.get<AllEventsResponse | ErrorResponse>(url)
	}

	async retrieveSingleEvent(eventSlug: EventSlug): Promise<AxiosResponse<SingleEventResponse | NonSuccessResponse>> {
		return await this.httpClient.http.get<SingleEventResponse | NonSuccessResponse>(
			this.buildUrl(`/single-event/${eventSlug}`)
		)
	}
}
