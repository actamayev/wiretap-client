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
import retrieveEventPriceHistory from "../../utils/events/retrieve-event-price-history"
import { timeframeConfig } from "../../utils/constants/polymarket-constants"
import { formatPercentage } from "../../utils/format"

// eslint-disable-next-line max-lines-per-function
function MultiMarketSingleEventPage({ eventSlug }: { eventSlug: EventSlug }): React.ReactNode {
	useEffect((): void => {
		void retrieveSingleEvent(eventSlug)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, authClass.isLoggedIn])

	const event = useMemo((): SingleEvent | undefined => {
		return eventsClass.events.get(eventSlug)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, eventsClass.events.size])

	// Get the selected market
	const selectedMarket = useMemo((): SingleMarket | undefined => {
		if (!event) return undefined
		return event.eventMarkets.find(
			(m): boolean => m.marketId === event.selectedMarketId
		) ?? event.eventMarkets[0]
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event, event?.selectedMarketId])

	// Update trade class with prices, market id, and clob token when event is available
	useEffect((): void => {
		if (!event || !selectedMarket) return
		tradeClass.setMarketId(selectedMarket.marketId)
		// Default to first outcome (index 0) when market changes
		const firstOutcome = selectedMarket.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
		if (firstOutcome) {
			tradeClass.setSelectedOutcomeIndex(0)
			tradeClass.setSelectedClobToken(firstOutcome.clobTokenId)
		}
	}, [event, selectedMarket])

	useEffect((): void => {
		if (!event) return
		document.title = `${event.eventTitle} | Wiretap`
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event?.eventTitle])

	// Get the selected outcome based on tradeClass.selectedMarket
	// Defaults to first outcome (index 0) if clobToken doesn't match
	const selectedOutcome = useMemo((): SingleOutcome | undefined => {
		if (!event || !selectedMarket) return undefined
		const matchedOutcome = selectedMarket.outcomes.find((outcome): boolean => outcome.clobTokenId === tradeClass.selectedClobToken)
		// If no match, default to first outcome (index 0)
		return matchedOutcome ?? selectedMarket.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
		// MobX observables - accessing properties ensures reactivity
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event, selectedMarket, tradeClass.selectedClobToken, selectedMarket?.marketId])

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
	): Promise<void> => {
		if (!selectedOutcome || !event || !selectedMarket) return

		// Check if already retrieving
		if (eventsClass.isRetrievingPriceHistory(
			event.eventSlug, selectedMarket.marketId, selectedOutcome.clobTokenId, timeframe
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
			event.eventSlug, selectedMarket.marketId, selectedOutcome.clobTokenId, timeframe, true
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
				selectedMarket.marketId,
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
				event.eventSlug, selectedMarket.marketId, selectedOutcome.clobTokenId, timeframe, false
			)
		} finally {
			setIsLoadingTimeframe(false)
		}
	}, [selectedOutcome, event, selectedMarket, hasRealHistoricalData])

	// Handle timeframe button click
	const handleTimeframeClick = useCallback((timeframe: keyof OutcomePriceHistories): void => {
		if (isLoadingTimeframe) return
		void fetchTimeframeData(timeframe)
	}, [fetchTimeframeData, isLoadingTimeframe])

	// Handle selecting a market to view its chart
	const handleSelectMarket = useCallback(async (marketId: MarketId): Promise<void> => {
		if (!event) return
		const market = event.eventMarkets.find((m): boolean => m.marketId === marketId)
		if (!market) return

		eventsClass.setSelectedMarketId(event.eventSlug, marketId)

		// Set the outcome to index 0 and update trade class
		const firstOutcome = market.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
		if (firstOutcome) {
			tradeClass.setSelectedOutcomeIndex(0)
			tradeClass.setMarketId(market.marketId)
			tradeClass.setSelectedClobToken(firstOutcome.clobTokenId)
		}

		// Fetch price history for the newly selected market (0th outcome)
		await retrieveEventPriceHistory(event.eventSlug, marketId)
		// Also trigger fetch for current timeframe to ensure chart updates
		// This will fetch if data doesn't exist or is only WebSocket data
		const currentTimeframe = event.selectedTimeframe ?? "1w"
		if (firstOutcome) {
			const existingData = firstOutcome.priceHistory[currentTimeframe]
			if (!existingData || existingData.length === 0 || !hasRealHistoricalData(existingData)) {
				await fetchTimeframeData(currentTimeframe, true)
			}
		}
	}, [event, fetchTimeframeData, hasRealHistoricalData])

	// Handle market outcome click
	const handleMarketOutcomeClick = useCallback((marketIndex: number, outcomeIndex: 0 | 1): void => {
		if (!event) return
		const market = event.eventMarkets[marketIndex]
		tradeClass.setSelectedOutcomeIndex(outcomeIndex)
		tradeClass.setMarketId(market.marketId)
		tradeClass.setSelectedClobToken(market.outcomes[outcomeIndex].clobTokenId)
	}, [event])

	// Automatically fetch current timeframe data when outcome changes (if data doesn't exist or is only WebSocket)
	useEffect((): void => {
		if (!selectedOutcome || !event || !selectedMarket || isLoadingTimeframe) return

		// Don't fetch if already retrieving
		if (eventsClass.isRetrievingPriceHistory(
			event.eventSlug, selectedMarket.marketId, selectedOutcome.clobTokenId, selectedTimeframe
		)) {
			return
		}

		const currentTimeframeData = selectedOutcome.priceHistory[selectedTimeframe]
		// If current timeframe doesn't have real historical data for this outcome, fetch it automatically
		// Skip timeframe update since we're already on this timeframe
		if (!currentTimeframeData || currentTimeframeData.length === 0 || !hasRealHistoricalData(currentTimeframeData)) {
			void fetchTimeframeData(selectedTimeframe, true)
		}
		// MobX observables - accessing properties ensures reactivity
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedOutcome, selectedMarket, selectedTimeframe, hasRealHistoricalData, selectedOutcome?.clobTokenId, selectedMarket?.marketId])

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
				{/* Left Column: Title area + Markets List + Chart + Rules */}
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
									key={`${selectedOutcome.clobTokenId}-${selectedTimeframe}`}
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

					{/* Rules */}
					<EventRules description={event.eventDescription} />
				</div>

				{/* Right Column: Trade Card + Markets List */}
				<div className="flex-1 flex flex-col gap-6 min-h-0">
					<TradeCard event={event} />

					{/* Markets List */}
					<div className="bg-sidebar-blue rounded-lg p-4 flex-1 min-h-0 flex flex-col">
						<div className={cn(
							"flex flex-col gap-2 overflow-y-auto flex-1 min-h-0",
							"[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
						)}>
							{event.eventMarkets.map((market, index): React.ReactNode => {
								const firstOutcomeText = market.outcomes.find(
									(outcome): boolean => outcome.outcomeIndex === 0
								)?.outcome
								const secondOutcomeText = market.outcomes.find(
									(outcome): boolean => outcome.outcomeIndex === 1
								)?.outcome

								const isSelected = market.marketId === event.selectedMarketId

								return (
									<div
										key={market.marketId}
										className={cn(
											"flex items-center gap-1 shrink-0 rounded-md px-2 py-1 cursor-pointer transition-colors",
											isSelected
												? "bg-primary/20"
												: "hover:bg-white/10"
										)}
										onClick={(): void => void handleSelectMarket(market.marketId)}
										title="View chart for this market"
									>
										{/* Group Icon */}
										{market.marketIconUrl ? (
											<div className="relative w-6 h-6 shrink-0 rounded-md overflow-hidden bg-muted">
												<Image
													src={market.marketIconUrl}
													alt={market.groupItemTitle || `Market ${index + 1}`}
													width={24}
													height={24}
													className="w-full h-full object-cover"
												/>
											</div>
										) : (
											<div className="w-6 h-6 shrink-0 rounded-md bg-muted" />
										)}

										{/* Group Name */}
										<div className={cn(
											"text-xs line-clamp-1 flex-1 min-w-0",
											isSelected ? "text-primary font-medium" : "text-white/80"
										)}>
											{market.groupItemTitle || market.marketQuestion || `Market ${index + 1}`}
										</div>

										{/* Midpoint Price */}
										<div className="text-xs text-yes-green font-medium shrink-0">
											{formatPercentage(market.midpointPrice)}%
										</div>

										{/* First Outcome Button */}
										<Button
											variant="default"
											size="sm"
											className={cn(
												"bg-yes-green hover:bg-yes-green-hover",
												"rounded-[5px] text-button-text text-[10px] h-5 px-1 shrink-0"
											)}
											onClick={(e): void => {
												e.stopPropagation()
												handleMarketOutcomeClick(index, 0)
											}}
										>
											{firstOutcomeText}
										</Button>

										{/* Second Outcome Button */}
										<Button
											variant="default"
											size="sm"
											className={cn(
												"bg-no-red hover:bg-no-red-hover",
												"rounded-[5px] text-button-text text-[10px] h-5 px-1 shrink-0"
											)}
											onClick={(e): void => {
												e.stopPropagation()
												handleMarketOutcomeClick(index, 1)
											}}
										>
											{secondOutcomeText}
										</Button>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</ContainerLayout>
	)
}

export default observer(MultiMarketSingleEventPage)
