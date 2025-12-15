"use client"

import Image from "next/image"
import { Clock } from "lucide-react"
import { observer } from "mobx-react"
import isUndefined from "lodash-es/isUndefined"
import { useMemo, useEffect } from "react"
import TradeCard from "./trade-card"
import EventRules from "./event-rules"
import CustomTooltip from "../custom-tooltip"
import authClass from "../../classes/auth-class"
import tradeClass from "../../classes/trade-class"
import eventsClass from "../../classes/events-class"
import PriceHistoryChart from "../price-history-chart"
import ContainerLayout from "../layouts/container-layout"
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

	// Update trade class with prices, market id, and clob token when event is available
	useEffect((): void => {
		if (!event) return
		const market = event.eventMarkets[0]
		// First outcome is Yes, second is No
		const yesOutcome = market.outcomes[0]
		const noOutcome = market.outcomes[1]

		tradeClass.setMarketId(market.marketId)
		// Set clob token based on selected market (Yes = index 0, No = index 1)
		const clobToken = tradeClass.selectedMarket === "Yes" ? yesOutcome.clobTokenId : noOutcome.clobTokenId
		tradeClass.setSelectedClobToken(clobToken)
	}, [event])

	useEffect((): void => {
		if (!event) return
		document.title = `${event.eventTitle} | Wiretap`
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event?.eventTitle])

	if (isUndefined(event)) {
		return (
			<div className="flex items-center justify-center h-full">
				<div>Loading...</div>
			</div>
		)
	}


	const formatDate = (date: Date): string => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		}).format(new Date(date))
	}

	const yesOutcome = event.eventMarkets[0]?.outcomes.find((outcome): boolean => outcome.outcome === "Yes")

	return (
		<ContainerLayout>
			<div className="flex flex-col gap-6 h-full p-6">
				{/* Row 1: Title with prefix, Volume and End Date */}
				<div className="flex flex-col items-center gap-3">
					<div className="flex items-center gap-3">
						<div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-muted">
							<Image
								src={event.eventIconUrl}
								alt={event.eventTitle}
								width={40}
								height={40}
								className="w-full h-full object-cover"
							/>
						</div>
						<h1 className="text-4xl font-semibold">{event.eventTitle}</h1>
					</div>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<span>${Math.floor(event.eventTotalVolume).toLocaleString()} Vol.</span>
						<CustomTooltip
							tooltipTrigger={
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									<span>{formatDate(event.eventEndDate)}</span>
								</div>
							}
							tooltipContent="This is the estimated end date. See rules below for specific resolution details."
							contentSide="bottom"
						/>
					</div>
				</div>

				{/* Row 2: Chart on left, Trade info on right */}
				<div className="flex gap-6 flex-1 min-h-0">
					{/* Left Section - Chart */}
					<div className="flex-2 flex flex-col gap-4 min-h-0">
						<div className="flex-1 min-h-0">
							<div className="bg-sidebar-blue rounded-lg p-4 h-full border-2 border-white/30">
								{yesOutcome?.priceHistory && (
									<PriceHistoryChart priceHistory={yesOutcome.priceHistory} />
								)}
							</div>
						</div>
					</div>

					{/* Right Section - Trading Interface and Rules */}
					<div className="flex-1 flex flex-col gap-6 min-h-0">
						<TradeCard event={event} />

						<EventRules description={event.eventDescription} />
					</div>
				</div>
			</div>
		</ContainerLayout>
	)
}

export default observer(SingleEventPage)
