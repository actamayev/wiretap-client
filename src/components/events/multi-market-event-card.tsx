"use client"

import Image from "next/image"
import { Eye } from "lucide-react"
import { observer } from "mobx-react"
import { useCallback, useState, useMemo } from "react"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import PriceHistoryChartCard from "../price-history-chart-card"
import tradeClass from "../../classes/trade-class"
import useTypedNavigate from "../../hooks/navigate/use-typed-navigate"
import authClass from "../../classes/auth-class"
import eventsClass from "../../classes/events-class"
import retrieveOutcomePriceHistory from "../../utils/polymarket/retrieve-outcome-price-history"
import retrieveEventPriceHistory from "../../utils/events/retrieve-event-price-history"
import { timeframeConfig } from "../../utils/constants/polymarket-constants"
import { cn } from "../../lib/utils"
import { formatPercentage } from "../../utils/format"

// eslint-disable-next-line max-lines-per-function
function MultiMarketEventCard({ event }: { event: SingleEvent }): React.ReactNode {
	const navigate = useTypedNavigate()

	// Get the selected market
	const selectedMarket = useMemo((): SingleMarket | undefined => {
		return event.eventMarkets.find(
			(m): boolean => m.marketId === event.selectedMarketId
		) ?? event.eventMarkets[0]
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event, event.selectedMarketId])

	const handleTitleClick = useCallback((): void => {
		// Check if user is logged in
		if (!authClass.isLoggedIn) {
			authClass.setPendingNavigation(event)
			authClass.setShowRegisterDialog(true)
			return
		}
		navigate(`/event/${event.eventSlug}`)
	}, [navigate, event])

	const handleMarketOutcomeClick = useCallback((marketIndex: number, outcomeIndex: 0 | 1): void => {
		// Check if user is logged in
		if (!authClass.isLoggedIn) {
			authClass.setPendingNavigation(event, outcomeIndex)
			authClass.setShowRegisterDialog(true)
			return
		}

		const market = event.eventMarkets[marketIndex]
		tradeClass.setSelectedOutcomeIndex(outcomeIndex)
		tradeClass.setMarketId(market.marketId)
		tradeClass.setSelectedClobToken(market.outcomes[outcomeIndex].clobTokenId)
		navigate(`/event/${event.eventSlug}`)
	}, [navigate, event])

	// Handle selecting a market to view its chart
	const handleSelectMarket = useCallback(async (marketId: MarketId): Promise<void> => {
		eventsClass.setSelectedMarketId(event.eventSlug, marketId)
		// Fetch price history for the newly selected market
		await retrieveEventPriceHistory(event.eventSlug, marketId)
	}, [event.eventSlug])

	// Get selected timeframe from the event
	const selectedTimeframe = useMemo((): keyof OutcomePriceHistories => {
		return event.selectedTimeframe ?? "1w"
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event.eventSlug, event.selectedTimeframe])
	const [isLoadingTimeframe, setIsLoadingTimeframe] = useState(false)

	// Get the First outcome of the selected market
	const firstOutcome = useMemo((): SingleOutcome | undefined => {
		return selectedMarket?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
	}, [selectedMarket])

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
	const fetchTimeframeData = useCallback(async (timeframe: keyof OutcomePriceHistories): Promise<void> => {
		if (!selectedMarket || !firstOutcome) return

		// Check if already retrieving
		if (eventsClass.isRetrievingPriceHistory(
			event.eventSlug, selectedMarket.marketId, firstOutcome.clobTokenId, timeframe
		)) {
			return
		}

		// Check if real historical data already exists (not just WebSocket updates)
		const existingData = firstOutcome.priceHistory[timeframe]
		if (existingData && hasRealHistoricalData(existingData)) {
			eventsClass.setSelectedTimeframe(event.eventSlug, timeframe)
			return
		}

		setIsLoadingTimeframe(true)
		eventsClass.setIsRetrievingPriceHistory(
			event.eventSlug, selectedMarket.marketId, firstOutcome.clobTokenId, timeframe, true
		)
		try {
			const config = timeframeConfig[timeframe]
			const priceHistoryResponse = await retrieveOutcomePriceHistory({
				market: firstOutcome.clobTokenId as string,
				interval: config.interval,
				fidelity: config.fidelity
			})
			eventsClass.setOutcomePriceHistory(
				event.eventSlug,
				selectedMarket.marketId,
				firstOutcome.clobTokenId,
				timeframe,
				priceHistoryResponse.history
			)
			eventsClass.setSelectedTimeframe(event.eventSlug, timeframe)
		} catch (error) {
			console.error(`Error retrieving price history for timeframe ${timeframe}:`, error)
			eventsClass.setIsRetrievingPriceHistory(
				event.eventSlug, selectedMarket.marketId, firstOutcome.clobTokenId, timeframe, false
			)
		} finally {
			setIsLoadingTimeframe(false)
		}
	}, [selectedMarket, firstOutcome, event.eventSlug, hasRealHistoricalData])

	// Handle timeframe button click
	const handleTimeframeClick = useCallback((timeframe: keyof OutcomePriceHistories): void => {
		if (isLoadingTimeframe) return
		void fetchTimeframeData(timeframe)
	}, [fetchTimeframeData, isLoadingTimeframe])

	// Multi-market card height: 2x single card height + gap (24px)
	// Single card: aspect-615/350 (mobile) or aspect-615/175 (desktop)
	// Height = 2 * (width * aspect-height/aspect-width) + gap
	// Using aspect ratio approximation: if single is 615/350, then 2x + gap ≈ 615/(350*2 + gap_equivalent)
	// For exact calculation, we'll use a custom aspect ratio that approximates this
	// Mobile: 615/724 (2*350 + 24), Desktop: 615/374 (2*175 + 24)
	const cardHeightClass = "aspect-[615/724] md:aspect-[615/374]"

	// Get timeframe keys in order: 1h, 1d, 1w, 1m, max (for vertical stacking)
	const timeframeKeys: Array<keyof OutcomePriceHistories> = ["1h", "1d", "1w", "1m", "max"]

	return (
		<div
			className={cn(
				"rounded-lg p-4 hover:shadow-md transition-shadow",
				"bg-sidebar-blue flex flex-col border border-white/50",
				cardHeightClass
			)}
		>
			{/* Top Section: Event Metadata and Markets List */}
			<div className="flex flex-col gap-3 flex-1 min-h-0">
				{/* Icon and Title */}
				<div className="flex items-center gap-3 shrink-0">
					<div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-transparent">
						<Image
							src={event.eventImageUrl}
							alt={event.eventTitle}
							width={48}
							height={48}
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="flex-1 min-w-0">
						<h3
							onClick={handleTitleClick}
							className="font-semibold text-lg line-clamp-2 cursor-pointer hover:underline"
						>
							{event.eventTitle}
						</h3>
					</div>
				</div>

				{/* Markets List - Scrollable */}
				<div className={cn(
					"flex flex-col gap-2 flex-1 overflow-y-auto min-h-0",
					"[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
				)}>
					{event.eventMarkets.map((market, index): React.ReactNode => {
						const firstOutcomeText = market.outcomes.find(
							(outcome): boolean => outcome.outcomeIndex === 0
						)?.outcome
						const secondOutcomeText = market.outcomes.find(
							(outcome): boolean => outcome.outcomeIndex === 1
						)?.outcome

						return (
							<div key={market.marketId} className="flex items-center gap-2 shrink-0">
								{/* Group Icon */}
								{market.marketIconUrl ? (
									<div className="relative w-8 h-8 shrink-0 rounded-md overflow-hidden bg-muted">
										<Image
											src={market.marketIconUrl}
											alt={market.groupItemTitle || `Market ${index + 1}`}
											width={32}
											height={32}
											className="w-full h-full object-cover"
										/>
									</div>
								) : (
									<div className="w-8 h-8 shrink-0 rounded-md bg-muted" />
								)}

								{/* Group Name */}
								<div className="text-sm text-white/80 line-clamp-1 flex-1 min-w-0">
									{market.groupItemTitle || market.marketQuestion || `Market ${index + 1}`}
								</div>

								{/* Midpoint Price */}
								<div className="text-sm text-yes-green font-medium shrink-0">
									{formatPercentage(market.midpointPrice)}%
								</div>

								{/* Eye Button */}
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"p-1 h-7 w-7 shrink-0",
										market.marketId === event.selectedMarketId
											? "text-primary"
											: "text-white/40 hover:text-white/80"
									)}
									onClick={(): void => void handleSelectMarket(market.marketId)}
									title="View chart for this market"
								>
									<Eye className="size-4" />
								</Button>

								{/* First Outcome Button */}
								<Button
									variant="outline"
									size="sm"
									className={cn(
										"bg-yes-green/20 hover:bg-yes-green/30",
										"rounded-[5px] text-button-text text-xs h-7 px-2 shrink-0"
									)}
									onClick={(): void => handleMarketOutcomeClick(index, 0)}
								>
									{firstOutcomeText}
								</Button>

								{/* Second Outcome Button */}
								<Button
									variant="outline"
									size="sm"
									className={cn(
										"bg-no-red/20 hover:bg-no-red/30",
										"rounded-[5px] text-button-text text-xs h-7 px-2 shrink-0"
									)}
									onClick={(): void => handleMarketOutcomeClick(index, 1)}
								>
									{secondOutcomeText}
								</Button>
							</div>
						)
					})}
				</div>
			</div>

			{/* Bottom Section: Timeframe and Chart */}
			<div className="flex gap-4 -mx-4 -mb-4 mt-4 shrink-0">
				{/* Left: Timeframe Buttons - Vertically Stacked */}
				<div className="flex flex-col gap-2 shrink-0 pl-4">
					{timeframeKeys.map((timeframe): React.ReactNode => (
						<Button
							key={timeframe}
							variant={selectedTimeframe === timeframe ? "default" : "outline"}
							size="sm"
							onClick={(): void => handleTimeframeClick(timeframe)}
							disabled={isLoadingTimeframe}
							className={cn(
								"min-w-[60px] h-9",
								selectedTimeframe === timeframe && "bg-primary text-primary-foreground"
							)}
						>
							{isLoadingTimeframe && selectedTimeframe === timeframe ? (
								<Spinner className="size-4" />
							) : (
								timeframeConfig[timeframe].label
							)}
						</Button>
					))}
				</div>

				{/* Right: Chart */}
				<div className="flex-1 min-h-0 overflow-hidden rounded-br-lg">
					{firstOutcome?.priceHistory[selectedTimeframe] &&
							firstOutcome.priceHistory[selectedTimeframe].length > 0 && (
						<PriceHistoryChartCard
							priceHistory={firstOutcome.priceHistory[selectedTimeframe].map(
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
	)
}

export default observer(MultiMarketEventCard)
