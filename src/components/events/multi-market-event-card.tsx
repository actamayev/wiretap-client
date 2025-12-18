"use client"

import Image from "next/image"
import { Eye } from "lucide-react"
import { observer } from "mobx-react"
import { useCallback, useState, useMemo } from "react"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import PriceHistoryChartCard from "../price-history-chart-card"
import { formatVolume, formatPercentage } from "../../utils/format"
import tradeClass from "../../classes/trade-class"
import useTypedNavigate from "../../hooks/navigate/use-typed-navigate"
import authClass from "../../classes/auth-class"
import eventsClass from "../../classes/events-class"
import retrieveOutcomePriceHistory from "../../utils/polymarket/retrieve-outcome-price-history"
import retrieveEventPriceHistory from "../../utils/events/retrieve-event-price-history"
import { timeframeConfig } from "../../utils/constants/polymarket-constants"
import { cn } from "../../lib/utils"

// eslint-disable-next-line max-lines-per-function, complexity
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

	// Get selected timeframe from the selected market
	const selectedTimeframe = useMemo((): keyof OutcomePriceHistories => {
		return selectedMarket?.selectedTimeframe ?? "1w"
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event.eventSlug, selectedMarket?.selectedTimeframe])
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
			eventsClass.setSelectedTimeframe(event.eventSlug, selectedMarket.marketId, timeframe)
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
			eventsClass.setSelectedTimeframe(event.eventSlug, selectedMarket.marketId, timeframe)
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

	// Get the index of the selected market for display purposes
	const selectedMarketIndex = event.eventMarkets.findIndex(
		(m): boolean => m.marketId === event.selectedMarketId
	)

	return (
		<div
			className={cn(
				"rounded-lg p-4 hover:shadow-md transition-shadow",
				"bg-sidebar-blue flex flex-col border border-white/50",
				cardHeightClass
			)}
		>
			{/* Mobile Layout: Stacked vertically */}
			<div className="flex flex-col gap-3 md:hidden w-full h-full">
				{/* Row 1: Image, Name, Percentage */}
				<div className="flex items-center gap-3">
					<div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted">
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
					<div className="shrink-0 text-xl font-bold text-yes-green">
						{formatPercentage(selectedMarket?.midpointPrice)}%
					</div>
				</div>

				{/* Row 2: Chart */}
				<div className="w-full h-48 rounded-[5px] overflow-hidden">
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

				{/* Row 3: Volume and Timeframe Selector */}
				<div className="flex items-center justify-between">
					<div className="text-sm text-white/40">
						{formatVolume(event.eventTotalVolume)}
					</div>
					<div className="flex gap-1">
						{(Object.keys(timeframeConfig) as Array<keyof OutcomePriceHistories>).map(
							(timeframe): React.ReactNode => (
								<Button
									key={timeframe}
									variant={selectedTimeframe === timeframe ? "default" : "outline"}
									size="sm"
									onClick={(): void => handleTimeframeClick(timeframe)}
									disabled={isLoadingTimeframe}
									className={cn(
										"min-w-[45px] h-7 text-xs px-2",
										selectedTimeframe === timeframe && "bg-primary text-primary-foreground"
									)}
								>
									{isLoadingTimeframe && selectedTimeframe === timeframe ? (
										<Spinner className="size-3" />
									) : (
										timeframeConfig[timeframe].label
									)}
								</Button>
							)
						)}
					</div>
				</div>

				{/* Row 4: Selected Market - First/Second Outcome Buttons */}
				<div className="flex gap-4">
					<Button
						variant="default"
						size="sm"
						className={cn(
							"flex-1 bg-yes-green hover:bg-yes-green-hover",
							"rounded-[5px] text-button-text text-lg h-10"
						)}
						onClick={(): void => handleMarketOutcomeClick(
							selectedMarketIndex >= 0 ? selectedMarketIndex : 0, 0
						)}
					>
						{selectedMarket?.outcomes.find(
							(outcome): boolean => outcome.outcomeIndex === 0
						)?.outcome}
					</Button>
					<Button
						variant="default"
						size="sm"
						className={cn(
							"flex-1 bg-no-red hover:bg-no-red-hover",
							"rounded-[5px] text-button-text text-lg h-10"
						)}
						onClick={(): void => handleMarketOutcomeClick(
							selectedMarketIndex >= 0 ? selectedMarketIndex : 0, 1
						)}
					>
						{selectedMarket?.outcomes.find(
							(outcome): boolean => outcome.outcomeIndex === 1
						)?.outcome}
					</Button>
				</div>

				{/* Markets List Section */}
				<div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/20 flex-1 overflow-y-auto">
					<div className="text-sm font-semibold text-white/60">Markets</div>
					{event.eventMarkets.map((market, index): React.ReactNode => (
						<div key={market.marketId} className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"p-1 h-6 w-6",
										market.marketId === event.selectedMarketId
											? "text-primary"
											: "text-white/40 hover:text-white/80"
									)}
									onClick={(): void => void handleSelectMarket(market.marketId)}
									title="View chart for this market"
								>
									<Eye className="size-4" />
								</Button>
								<div className="text-xs text-white/50 line-clamp-1 flex-1">
									{market.marketQuestion || market.groupItemTitle || `Market ${index + 1}`}
								</div>
								<div className="text-xs text-yes-green font-medium">
									{formatPercentage(market.midpointPrice)}%
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Desktop Layout: Side by side */}
			<div className="hidden md:flex gap-8 w-full flex-1 min-h-0">
				{/* Left Section - 3/5 width */}
				<div className="w-3/5 flex flex-col gap-3 h-full">
					{/* Row 1: Image, Name, Percentage */}
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted">
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
						<div className="shrink-0 text-xl font-bold text-yes-green">
							{formatPercentage(selectedMarket?.midpointPrice)}%
						</div>
					</div>

					{/* Row 2: Selected Market - First/Second Outcome Buttons */}
					<div className="flex gap-4">
						<Button
							variant="default"
							size="sm"
							className={cn(
								"flex-1 bg-yes-green hover:bg-yes-green-hover",
								"rounded-[5px] text-button-text text-lg h-10"
							)}
							onClick={(): void => handleMarketOutcomeClick(
								selectedMarketIndex >= 0 ? selectedMarketIndex : 0, 0
							)}
						>
							{selectedMarket?.outcomes.find(
								(outcome): boolean => outcome.outcomeIndex === 0
							)?.outcome}
						</Button>
						<Button
							variant="default"
							size="sm"
							className={cn(
								"flex-1 bg-no-red hover:bg-no-red-hover",
								"rounded-[5px] text-button-text text-lg h-10"
							)}
							onClick={(): void => handleMarketOutcomeClick(
								selectedMarketIndex >= 0 ? selectedMarketIndex : 0, 1
							)}
						>
							{selectedMarket?.outcomes.find(
								(outcome): boolean => outcome.outcomeIndex === 1
							)?.outcome}
						</Button>
					</div>

					{/* Row 3: Volume and Timeframe Selector */}
					<div className="flex items-center justify-between">
						<div className="text-sm text-white/40">
							{formatVolume(event.eventTotalVolume)}
						</div>
						<div className="flex gap-1">
							{(Object.keys(timeframeConfig) as Array<keyof OutcomePriceHistories>).map(
								(timeframe): React.ReactNode => (
									<Button
										key={timeframe}
										variant={selectedTimeframe === timeframe ? "default" : "outline"}
										size="sm"
										onClick={(): void => handleTimeframeClick(timeframe)}
										disabled={isLoadingTimeframe}
										className={cn(
											"min-w-[45px] h-7 text-xs px-2",
											selectedTimeframe === timeframe && "bg-primary text-primary-foreground"
										)}
									>
										{isLoadingTimeframe && selectedTimeframe === timeframe ? (
											<Spinner className="size-3" />
										) : (
											timeframeConfig[timeframe].label
										)}
									</Button>
								)
							)}
						</div>
					</div>

					{/* Markets List Section */}
					<div className="flex flex-col gap-2 flex-1 overflow-y-auto">
						<div className="text-sm font-semibold text-white/60">Markets</div>
						{event.eventMarkets.map((market, index): React.ReactNode => (
							<div key={market.marketId} className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="sm"
										className={cn(
											"p-1 h-6 w-6",
											market.marketId === event.selectedMarketId
												? "text-primary"
												: "text-white/40 hover:text-white/80"
										)}
										onClick={(): void => void handleSelectMarket(market.marketId)}
										title="View chart for this market"
									>
										<Eye className="size-4" />
									</Button>
									<div className="text-xs text-white/50 line-clamp-1 flex-1">
										{market.groupItemTitle || market.marketQuestion || `Market ${index + 1}`}
									</div>
									<div className="text-xs text-yes-green font-medium">
										{formatPercentage(market.midpointPrice)}%
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right Section - 2/5 width */}
				<div className="w-2/5 flex flex-col h-full min-h-0">
					<div className="flex-1 min-h-0 rounded-[5px] overflow-hidden">
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
		</div>
	)
}

export default observer(MultiMarketEventCard)
