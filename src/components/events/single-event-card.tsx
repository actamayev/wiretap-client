
"use client"

import Image from "next/image"
import { observer } from "mobx-react"
import { useCallback, useState, useMemo } from "react"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import PriceHistoryChartCard from "../price-history-chart-card"
import { formatVolume } from "../../utils/format"
import tradeClass from "../../classes/trade-class"
import useTypedNavigate from "../../hooks/navigate/use-typed-navigate"
import authClass from "../../classes/auth-class"
import eventsClass from "../../classes/events-class"
import retrieveOutcomePriceHistory from "../../utils/polymarket/retrieve-outcome-price-history"
import { timeframeConfig } from "../../utils/constants/polymarket-constants"
import { cn } from "../../lib/utils"

// eslint-disable-next-line max-lines-per-function, complexity
function SingleEventCard({ event }: { event: SingleEvent }): React.ReactNode {
	const navigate = useTypedNavigate()

	const handleTitleClick = useCallback((): void => {
		// Check if user is logged in
		if (!authClass.isLoggedIn) {
			authClass.setPendingNavigation(event)
			authClass.setShowRegisterDialog(true)
			return
		}
		navigate(`/event/${event.eventSlug}`)
	}, [navigate, event])

	const handleFirstOutcomeClick = useCallback((): void => {
		// Check if user is logged in
		if (!authClass.isLoggedIn) {
			authClass.setPendingNavigation(event, 0)
			authClass.setShowRegisterDialog(true)
			return
		}

		const firstMarket = event.eventMarkets[0]
		if (!firstMarket) return
		tradeClass.setSelectedOutcomeIndex(0)
		tradeClass.setMarketId(firstMarket.marketId)
		tradeClass.setSelectedClobToken(firstMarket.outcomes[0].clobTokenId)
		navigate(`/event/${event.eventSlug}`)
	}, [navigate, event])

	const handleSecondOutcomeClick = useCallback((): void => {
		// Check if user is logged in
		if (!authClass.isLoggedIn) {
			authClass.setPendingNavigation(event, 1)
			authClass.setShowRegisterDialog(true)
			return
		}

		const firstMarket = event.eventMarkets[0]
		if (!firstMarket) return
		tradeClass.setSelectedOutcomeIndex(1)
		tradeClass.setMarketId(firstMarket.marketId)
		tradeClass.setSelectedClobToken(firstMarket.outcomes[1].clobTokenId)
		navigate(`/event/${event.eventSlug}`)
	}, [navigate, event])

	// Get the market (single market events only have one)
	const market = useMemo((): SingleMarket | undefined => {
		return event.eventMarkets[0]
	}, [event])

	// Get selected timeframe from events class
	const selectedTimeframe = useMemo((): keyof OutcomePriceHistories => {
		return market?.selectedTimeframe ?? "1w"
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event.eventSlug, market?.selectedTimeframe])
	const [isLoadingTimeframe, setIsLoadingTimeframe] = useState(false)

	// Get the First outcome
	const firstOutcome = useMemo((): SingleOutcome | undefined => {
		return market?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
	}, [market])

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
		if (!market || !firstOutcome) return

		// Check if already retrieving
		if (eventsClass.isRetrievingPriceHistory(event.eventSlug, market.marketId, firstOutcome.clobTokenId, timeframe)) {
			return
		}

		// Check if real historical data already exists (not just WebSocket updates)
		const existingData = firstOutcome.priceHistory[timeframe]
		if (existingData && hasRealHistoricalData(existingData)) {
			eventsClass.setSelectedTimeframe(event.eventSlug, market.marketId, timeframe)
			return
		}

		setIsLoadingTimeframe(true)
		eventsClass.setIsRetrievingPriceHistory(event.eventSlug, market.marketId, firstOutcome.clobTokenId, timeframe, true)
		try {
			const config = timeframeConfig[timeframe]
			const priceHistoryResponse = await retrieveOutcomePriceHistory({
				market: firstOutcome.clobTokenId as string,
				interval: config.interval,
				fidelity: config.fidelity
			})
			eventsClass.setOutcomePriceHistory(
				event.eventSlug,
				market.marketId,
				firstOutcome.clobTokenId,
				timeframe,
				priceHistoryResponse.history
			)
			eventsClass.setSelectedTimeframe(event.eventSlug, market.marketId, timeframe)
		} catch (error) {
			console.error(`Error retrieving price history for timeframe ${timeframe}:`, error)
			eventsClass.setIsRetrievingPriceHistory(event.eventSlug, market.marketId, firstOutcome.clobTokenId, timeframe, false)
		} finally {
			setIsLoadingTimeframe(false)
		}
	}, [market, firstOutcome, event.eventSlug, hasRealHistoricalData])

	// Handle timeframe button click
	const handleTimeframeClick = useCallback((timeframe: keyof OutcomePriceHistories): void => {
		if (isLoadingTimeframe) return
		void fetchTimeframeData(timeframe)
	}, [fetchTimeframeData, isLoadingTimeframe])

	return (
		<div
			className={cn(
				"rounded-lg p-4 hover:shadow-md transition-shadow",
				"bg-sidebar-blue aspect-615/350 md:aspect-615/175 flex flex-col border border-white/50"
			)}
		>
			{/* Mobile Layout: Stacked vertically */}
			<div className="flex flex-col gap-3 md:hidden w-full">
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
						{((): number | string => {
							const percentage = (market?.midpointPrice ?? 0) * 100
							if (percentage >= 99.5) return ">99"
							if (percentage < 1 && percentage > 0) return "< 1"
							return Math.round(percentage)
						})()}%
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

				{/* Row 4: First/Second Outcome Buttons */}
				<div className="flex gap-4">
					<Button
						variant="default"
						size="sm"
						className="flex-1 bg-yes-green hover:bg-yes-green-hover rounded-[5px] text-button-text text-lg h-10"
						onClick={handleFirstOutcomeClick}
					>
						{market?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)?.outcome}
					</Button>
					<Button
						variant="default"
						size="sm"
						className="flex-1 bg-no-red hover:bg-no-red-hover rounded-[5px] text-button-text text-lg h-10"
						onClick={handleSecondOutcomeClick}
					>
						{market?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 1)?.outcome}
					</Button>
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
							{((): number | string => {
								const percentage = (market?.midpointPrice ?? 0) * 100
								if (percentage >= 99.5) return ">99"
								if (percentage < 1 && percentage > 0) return "< 1"
								return Math.round(percentage)
							})()}%
						</div>
					</div>

					{/* Row 2: First/Second Outcome Buttons */}
					<div className="flex gap-4">
						<Button
							variant="default"
							size="sm"
							className="flex-1 bg-yes-green hover:bg-yes-green-hover rounded-[5px] text-button-text text-lg h-10"
							onClick={handleFirstOutcomeClick}
						>
							{market?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)?.outcome}
						</Button>
						<Button
							variant="default"
							size="sm"
							className="flex-1 bg-no-red hover:bg-no-red-hover rounded-[5px] text-button-text text-lg h-10"
							onClick={handleSecondOutcomeClick}
						>
							{market?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 1)?.outcome}
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

export default observer(SingleEventCard)
