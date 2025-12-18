"use client"

import { observer } from "mobx-react"
import { useMemo, useEffect } from "react"
import isUndefined from "lodash-es/isUndefined"
import SingleMarketSingleEventPage from "./single-market-single-event-page"
import MultiMarketSingleEventPage from "./multi-market-single-event-page"
import authClass from "../../classes/auth-class"
import eventsClass from "../../classes/events-class"
import retrieveSingleEvent from "../../utils/events/retrieve-single-event"

function SingleEventPage({ eventSlug }: { eventSlug: EventSlug }): React.ReactNode {
	useEffect((): void => {
		void retrieveSingleEvent(eventSlug)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, authClass.isLoggedIn])

	const event = useMemo((): SingleEvent | undefined => {
		return eventsClass.events.get(eventSlug)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, eventsClass.events.size])

	// Show loading state while event is being fetched
	if (isUndefined(event)) {
		return (
			<div className="flex items-center justify-center h-full">
				<div>Loading...</div>
			</div>
		)
	}

	// Determine if this is a multi-market event (more than 1 market)
	const isMultiMarket = event.eventMarkets.length > 1

	// Route to appropriate component based on event type
	if (isMultiMarket) {
		return <MultiMarketSingleEventPage eventSlug={eventSlug} />
	}

	return <SingleMarketSingleEventPage eventSlug={eventSlug} />
}

export default observer(SingleEventPage)
