"use client"

import isEqual from "lodash-es/isEqual"
import { isErrorResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import eventsClass from "../../classes/events-class"

export default async function retrieveAllEvents(): Promise<void> {
	try {
		if (
			eventsClass.isRetrievingAllEvents === true ||
			eventsClass.hasRetrievedAllEvents === true
		) return

		eventsClass.setIsRetrievingAllEvents(true)

		const eventsResponse = await wiretapApiClient.eventsDataService.retrieveAllEvents()
		if (!isEqual(eventsResponse.status, 200) || isErrorResponse(eventsResponse.data)) {
			throw Error ("Unable to retrieve events")
		}

		eventsClass.setEventsMetadata(eventsResponse.data.events)
	} catch (error) {
		console.error(error)
		eventsClass.setIsRetrievingAllEvents(false)
	}
}
