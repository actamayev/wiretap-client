"use client"

import isEqual from "lodash-es/isEqual"
import isNull from "lodash-es/isNull"
import authClass from "../../classes/auth-class"
import eventsClass from "../../classes/events-class"
import { isNonSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"

export default async function retrieveSingleEvent(eventSlug: EventSlug): Promise<void> {
	try {
		if (
			authClass.isFinishedWithSignup === false ||
			eventsClass.isRetrievingSingleEvent(eventSlug) === true ||
			eventsClass.events.get(eventSlug) !== undefined
		) return

		eventsClass.setIsRetrievingSingleEvent(eventSlug, true)

		const eventsResponse = await wiretapApiClient.eventsDataService.retrieveSingleEvent(eventSlug)
		if (!isEqual(eventsResponse.status, 200) || isNonSuccessResponse(eventsResponse.data)) {
			throw Error ("Unable to retrieve event")
		}

		if (isNull(eventsResponse.data.event)) {
			throw Error ("Unable to retrieve event")
		}

		eventsClass.addEvent(eventSlug, eventsResponse.data.event)
	} catch (error) {
		console.error(error)
		eventsClass.setIsRetrievingSingleEvent(eventSlug, false)
	}
}
