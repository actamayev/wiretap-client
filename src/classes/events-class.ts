import { action, makeAutoObservable } from "mobx"

const events: SingleEvent[] = [
	{
		eventUUID: "123e4567-e89b-12d3-a456-426614174000" as EventUUID,
		eventName: "Event 1",
		eventDescription: "Event 1 description",
		eventImage: "https://example.com/event1.jpg",
		eventLink: "https://example.com/event1"
	}
]

class EventsClass {
	public isRetrievingAllEvents = false
	public hasRetrievedAllEvents = false
	public retrievingSingleEvent: Map<EventUUID, boolean> = new Map()
	public events: Map<EventUUID, SingleEvent> = new Map()

	constructor() {
		makeAutoObservable(this)
		this.setEvents(events)
	}

	public setIsRetrievingAllEvents = action((newIsRetrievingAllEvents: boolean): void => {
		this.isRetrievingAllEvents = newIsRetrievingAllEvents
	})

	public setHasRetrievedAllEvents = action((newHasRetrievedAllEvents: boolean): void => {
		this.hasRetrievedAllEvents = newHasRetrievedAllEvents
	})

	public setIsRetrievingSingleEvent = action((eventUUID: EventUUID, newIsRetrievingSingleEvent: boolean): void => {
		this.retrievingSingleEvent.set(eventUUID, newIsRetrievingSingleEvent)
	})

	public setEvents = action((newEvents: SingleEvent[]): void => {
		newEvents.forEach((event): void => this.addEvent(event.eventUUID, event))
		this.setHasRetrievedAllEvents(true)
		this.setIsRetrievingAllEvents(false)
	})

	public addEvent = action((eventUUID: EventUUID, event: SingleEvent): void => {
		this.events.set(eventUUID, event)
	})

	public isRetrievingSingleEvent = (eventUUID: EventUUID): boolean => {
		return this.retrievingSingleEvent.get(eventUUID) || false
	}

	logout(): void {
		this.isRetrievingAllEvents = false
		this.hasRetrievedAllEvents = false
		this.retrievingSingleEvent = new Map()
		this.events = new Map()
	}
}

const eventsClass = new EventsClass()

export default eventsClass
