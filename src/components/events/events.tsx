"use client"

import { useMemo } from "react"
import { observer } from "mobx-react"
import SingleEvent from "./single-event"
import eventsClass from "../../classes/events-class"
import WorkbenchLayout from "../layouts/internal-container-layout"

function Events(): React.ReactNode {
	const events = useMemo((): SingleEvent[] => {
		return Array.from(eventsClass.events.values())
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventsClass.events.size])

	return (
		<WorkbenchLayout preventElasticScroll={true}>
			<div className="flex flex-col h-full w-full p-6">
				<div className="mb-6">
					<h1 className="text-3xl font-bold">Events</h1>
					<p className="text-muted-foreground mt-2">
						Choose a game to play and learn about coding and robotics
					</p>
				</div>

				{/* Game Cards */}
				<div className="flex flex-col gap-6 w-full">
					{events.map((event): React.ReactNode => {
						return <SingleEvent key={event.eventUUID} event={event} />
					})}
				</div>
			</div>
		</WorkbenchLayout>
	)
}

export default observer(Events)
