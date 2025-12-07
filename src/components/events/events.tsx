"use client"

import { useEffect, useMemo } from "react"
import { observer } from "mobx-react"
import SingleEvent from "./single-event"
import eventsClass from "../../classes/events-class"
import InternalContainerLayout from "../layouts/internal-container-layout"
import retrieveAllEvents from "../../utils/events/retrieve-all-events"

function Events(): React.ReactNode {
	useEffect((): void => {
		void retrieveAllEvents()
	}, [])

	const events = useMemo((): SingleEvent[] => {
		return Array.from(eventsClass.events.values())
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventsClass.events.size])

	return (
		<InternalContainerLayout preventElasticScroll={true}>
			<div className="flex flex-col h-full w-full p-6">
				<div className="flex flex-col gap-6 w-full">
					{events.map((event): React.ReactNode => {
						return <SingleEvent key={event.eventId} event={event} />
					})}
				</div>
			</div>
		</InternalContainerLayout>
	)
}

export default observer(Events)
