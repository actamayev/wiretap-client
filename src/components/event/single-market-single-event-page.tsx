"use client"

import Image from "next/image"
import { Clock } from "lucide-react"
import { CustomPolymarket } from "../../icons/custom-polymarket"
import { observer } from "mobx-react"
import isUndefined from "lodash-es/isUndefined"
import { useMemo, useEffect, useState, useCallback } from "react"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { cn } from "../../lib/utils"
import TradeCard from "./trade-card"
import EventRules from "./event-rules"
import CustomTooltip from "../custom-tooltip"
import authClass from "../../classes/auth-class"
import tradeClass from "../../classes/trade-class"
import eventsClass from "../../classes/events-class"
import PriceHistoryChartPage from "../price-history-chart-page"
import ContainerLayout from "../layouts/container-layout"
import retrieveSingleEvent from "../../utils/events/retrieve-single-event"
import retrieveOutcomePriceHistory from "../../utils/polymarket/retrieve-outcome-price-history"
import { timeframeConfig } from "../../utils/constants/polymarket-constants"

// eslint-disable-next-line max-lines-per-function
function SingleMarketSingleEventPage({ eventSlug }: { eventSlug: EventSlug }): React.ReactNode {
	useEffect((): void => {
		void retrieveSingleEvent(eventSlug)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, authClass.isLoggedIn])

	const event = useMemo((): SingleEvent | undefined => {
		return eventsClass.events.get(eventSlug)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, eventsClass.events.size])

	// Get the selected market
	const market = useMemo((): SingleMarket | undefined => {
		if (!event) return undefined
		return event.eventMarkets.find(
			(m): boolean => m.marketId === event.selectedMarketId
		) ?? event.eventMarkets[0]
	}, [event])

	// Update trade class with prices, market id, and clob token when event is available
	useEffect((): void => {
		if (!event || !market) return
		tradeClass.setMarketId(market.marketId)
		// Use the selected outcome index if set, otherwise default to first outcome
		const selectedOutcomeIndex = tradeClass.selectedOutcomeIndex ?? 0
		const selectedClobToken = market.outcomes.find(
			(outcome): boolean => outcome.outcomeIndex === selectedOutcomeIndex
		)?.clobTokenId
		tradeClass.setSelectedClobToken(selectedClobToken)
	}, [event, market])

	useEffect((): void => {
		if (!event) return
		document.title = `${event.eventTitle} | Wiretap`
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event?.eventTitle])

	// Get the selected outcome based on tradeClass.selectedMarket
	const selectedOutcome = useMemo((): SingleOutcome | undefined => {
		if (!event || !market) return undefined
		return market.outcomes.find((outcome): boolean => outcome.clobTokenId === tradeClass.selectedClobToken)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event, market, tradeClass.selectedClobToken])

	// Get selected timeframe from events class
	const selectedTimeframe = useMemo((): keyof OutcomePriceHistories => {
		if (!event) return "1w"
		return event.selectedTimeframe ?? "1w"
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event, event?.selectedTimeframe])

	const [isLoadingTimeframe, setIsLoadingTimeframe] = useState(false)

	// Helper function to check if data is real historical data or just WebSocket updates
	const hasRealHistoricalData = useCallback((
		data: PriceHistoryEntry[]
	): boolean => {
		if (!data || data.length === 0) return false

		// Check if we have at least one data point that is NOT from WebSocket
		// If all data points are WebSocket updates, we don't have real historical data
		return data.some((entry): boolean => !entry.isWebSocket)
	}, [])

	// Function to fetch price history for a specific timeframe
	const fetchTimeframeData = useCallback(async (
		timeframe: keyof OutcomePriceHistories,
		skipTimeframeUpdate = false
	// eslint-disable-next-line complexity
	): Promise<void> => {
		if (!selectedOutcome || !event || !market) return

		// Check if already retrieving
		if (eventsClass.isRetrievingPriceHistory(
			event.eventSlug, market.marketId, selectedOutcome.clobTokenId, timeframe
		)) {
			return
		}

		// Check if real historical data already exists (not just WebSocket updates)
		const existingData = selectedOutcome.priceHistory[timeframe]
		if (existingData && hasRealHistoricalData(existingData)) {
			// Only update timeframe state if not skipping (e.g., when called from button click)
			if (!skipTimeframeUpdate) {
				eventsClass.setSelectedTimeframe(event.eventSlug, timeframe)
			}
			return
		}

		setIsLoadingTimeframe(true)
		eventsClass.setIsRetrievingPriceHistory(
			event.eventSlug, market.marketId, selectedOutcome.clobTokenId, timeframe, true
		)
		try {
			const config = timeframeConfig[timeframe]
			const priceHistoryResponse = await retrieveOutcomePriceHistory({
				market: selectedOutcome.clobTokenId as string,
				interval: config.interval,
				fidelity: config.fidelity
			})
			eventsClass.setOutcomePriceHistory(
				event.eventSlug,
				market.marketId,
				selectedOutcome.clobTokenId,
				timeframe,
				priceHistoryResponse.history
			)
			// Only update timeframe state if not skipping (e.g., when called from button click)
			if (!skipTimeframeUpdate) {
				eventsClass.setSelectedTimeframe(event.eventSlug, timeframe)
			}
		} catch (error) {
			console.error(`Error retrieving price history for timeframe ${timeframe}:`, error)
			eventsClass.setIsRetrievingPriceHistory(
				event.eventSlug, market.marketId, selectedOutcome.clobTokenId, timeframe, false
			)
		} finally {
			setIsLoadingTimeframe(false)
		}
	}, [selectedOutcome, event, market, hasRealHistoricalData])

	// Handle timeframe button click
	const handleTimeframeClick = useCallback((timeframe: keyof OutcomePriceHistories): void => {
		if (isLoadingTimeframe) return
		void fetchTimeframeData(timeframe)
	}, [fetchTimeframeData, isLoadingTimeframe])

	// Automatically fetch current timeframe data when outcome changes (if data doesn't exist or is only WebSocket)
	useEffect((): void => {
		if (!selectedOutcome || !event || !market || isLoadingTimeframe) return

		// Don't fetch if already retrieving
		if (eventsClass.isRetrievingPriceHistory(
			event.eventSlug, market.marketId, selectedOutcome.clobTokenId, selectedTimeframe
		)) {
			return
		}

		const currentTimeframeData = selectedOutcome.priceHistory[selectedTimeframe]
		// If current timeframe doesn't have real historical data for this outcome, fetch it automatically
		// Skip timeframe update since we're already on this timeframe
		if (!currentTimeframeData || currentTimeframeData.length === 0 || !hasRealHistoricalData(currentTimeframeData)) {
			void fetchTimeframeData(selectedTimeframe, true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedOutcome, market, selectedTimeframe, hasRealHistoricalData])

	if (isUndefined(event)) {
		return (
			<div className="flex items-center justify-center h-full">
				<div>Loading...</div>
			</div>
		)
	}

	const formatDate = (date: Date): string => {
		const d = new Date(date)
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			timeZone: "UTC"
		}).format(d)
	}

	return (
		<ContainerLayout>
			<div className="flex gap-6 h-full p-6">
				{/* Left Column: Title area + Chart + Timescale */}
				<div className="flex-2 flex flex-col gap-6 min-h-0">
					{/* Title with prefix, Volume and End Date */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-transparent">
								<Image
									src={event.eventIconUrl}
									alt={event.eventTitle}
									width={40}
									height={40}
									className="w-full h-full object-cover"
								/>
							</div>
							<h1 className="text-4xl font-semibold">
								<a
									href={`https://polymarket.com/event/${eventSlug}`}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline"
								>
									{event.eventTitle}
								</a>
							</h1>
							<a
								href={`https://polymarket.com/event/${eventSlug}`}
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									"relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-transparent",
									"flex items-center justify-center hover:opacity-80 transition-opacity"
								)}
							>
								<CustomPolymarket className="size-10!" />
							</a>
						</div>
						<div className="flex items-center justify-between">
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
							{/* Timeframe Selector */}
							<div className="flex gap-2">
								{(Object.keys(timeframeConfig) as Array<keyof OutcomePriceHistories>).map(
									(timeframe): React.ReactNode => (
										<Button
											key={timeframe}
											variant={selectedTimeframe === timeframe ? "default" : "outline"}
											size="sm"
											onClick={(): void => handleTimeframeClick(timeframe)}
											disabled={isLoadingTimeframe}
											className={cn(
												"min-w-[60px]",
												selectedTimeframe === timeframe
													? "bg-primary text-primary-foreground"
													: "bg-[rgb(29,42,57)] border-white/20 hover:bg-white/10 hover:border-white/30"
											)}
										>
											{isLoadingTimeframe && selectedTimeframe === timeframe ? (
												<Spinner className="size-4" />
											) : (
												timeframeConfig[timeframe].label
											)}
										</Button>
									)
								)}
							</div>
						</div>
					</div>

					{/* Chart */}
					<div className="flex-1 min-h-0">
						<div className="h-full rounded-lg overflow-hidden">
							{selectedOutcome?.priceHistory[selectedTimeframe] &&
								selectedOutcome.priceHistory[selectedTimeframe].length > 0 && (
								<PriceHistoryChartPage
									priceHistory={selectedOutcome.priceHistory[selectedTimeframe].map(
										(entry): SinglePriceSnapshot => ({
											timestamp: new Date(entry.t * 1000),
											price: entry.p
										})
									)}
								/>
							)}
						</div>
					</div>
				</div>

				{/* Right Column: Trade Card + Rules */}
				<div className="flex-1 flex flex-col gap-6 min-h-0">
					<TradeCard event={event} />
					<EventRules description={event.eventDescription} />
				</div>
			</div>
		</ContainerLayout>
	)
}

export default observer(SingleMarketSingleEventPage)
