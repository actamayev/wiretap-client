import { action, makeAutoObservable } from "mobx"

const events: SingleEvent[] = [
	{
		eventId: 123321n as EventId,
		eventSlug: "event-1" as EventSlug,
		eventTitle: "Event 1",
		eventDescription: "Event 1 description",
		eventImageUrl: "https://example.com/event1.jpg",
		eventIconUrl: "https://example.com/event1.jpg",
		eventPolymarketUrl: "https://example.com/event1",
		eventCreatedAt: new Date(),
		eventUpdatedAt: new Date(),
		eventMarkets: []
	}
]

class EventsClass {
	public isRetrievingAllEvents = false
	public hasRetrievedAllEvents = false
	public retrievingSingleEvent: Map<EventSlug, boolean> = new Map()
	public events: Map<EventSlug, SingleEvent> = new Map()

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

	public setIsRetrievingSingleEvent = action((eventSlug: EventSlug, newIsRetrievingSingleEvent: boolean): void => {
		this.retrievingSingleEvent.set(eventSlug, newIsRetrievingSingleEvent)
	})

	public setEvents = action((newEvents: SingleEvent[]): void => {
		newEvents.forEach((event): void => this.addEvent(event.eventSlug, event))
		this.setHasRetrievedAllEvents(true)
		this.setIsRetrievingAllEvents(false)
	})

	public addEvent = action((eventSlug: EventSlug, event: SingleEvent): void => {
		this.events.set(eventSlug, event)
	})

	public isRetrievingSingleEvent = (eventSlug: EventSlug): boolean => {
		return this.retrievingSingleEvent.get(eventSlug) || false
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
