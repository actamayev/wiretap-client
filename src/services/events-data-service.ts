import { AxiosResponse } from "axios"
import WiretapHttpClient from "../classes/wiretap-http-client"
import { BaseDataService } from "./base-data-service"

export default class EventsDataService extends BaseDataService {
	constructor(httpClient: WiretapHttpClient, pathHeader: EndpointHeaders) {
		super(httpClient, pathHeader)
	}

	async retrieveAllEvents(): Promise<AxiosResponse<AllEventsResponse | ErrorResponse>> {
		return await this.httpClient.http.get<AllEventsResponse | ErrorResponse>(
			this.buildUrl("/all-events")
		)
	}

	async retrieveSingleEvent(eventSlug: EventSlug): Promise<AxiosResponse<SingleEventResponse | NonSuccessResponse>> {
		return await this.httpClient.http.get<SingleEventResponse | NonSuccessResponse>(
			this.buildUrl(`/single-event/${eventSlug}`)
		)
	}
}
