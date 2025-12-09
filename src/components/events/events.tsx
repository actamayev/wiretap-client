"use client"

import { useEffect, useMemo } from "react"
import { observer } from "mobx-react"
import eventsClass from "../../classes/events-class"
import InternalContainerLayout from "../layouts/internal-container-layout"
import retrieveAllEvents from "../../utils/events/retrieve-all-events"
import authClass from "../../classes/auth-class"
import SingleEventCard from "./single-event-card"

function Events(): React.ReactNode {
	useEffect((): void => {
		void retrieveAllEvents()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authClass.isFinishedWithSignup])

	const events = useMemo((): SingleEvent[] => {
		return Array.from(eventsClass.events.values())
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventsClass.events.size])

	return (
		<InternalContainerLayout preventElasticScroll={true}>
			<div className="flex flex-col h-full w-full p-6">
				<div className="grid grid-cols-2 gap-6 w-full">
					{events.map((event): React.ReactNode => {
						return <SingleEventCard key={event.eventId} event={event} />
					})}
				</div>
			</div>
		</InternalContainerLayout>
	)
}

export default observer(Events)
