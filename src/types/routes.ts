import { staticPages } from "../utils/constants/page-constants"

declare global {
	type EventsPages =
		| "/events"
		| `/events/${EventUUID}`

	type FundsPages =
		| "/funds"
		| `/funds/${FundsUUID}`

	type StaticPageNames = (typeof staticPages)[number];

	type PageNames = (typeof staticPages)[number] | EventsPages | FundsPages
}

export {}
