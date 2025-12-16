/* eslint-disable max-len */
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
import RegisterDialog from "../register-dialog"
import retrieveOutcomePriceHistory from "../../utils/polymarket/retrieve-outcome-price-history"
import { timeframeConfig } from "../../utils/constants/timeframe-config"
import { cn } from "../../lib/utils"

// eslint-disable-next-line max-lines-per-function, complexity
function SingleEventCard({ event }: { event: SingleEvent }): React.ReactNode {
	const navigate = useTypedNavigate()
	const [showRegisterDialog, setShowRegisterDialog] = useState(false)
	const [pendingNavigation, setPendingNavigation] = useState<{
		eventSlug: EventSlug
		marketIndex?: number
	} | null>(null)

	const handleTitleClick = useCallback((): void => {
		// Check if user is logged in
		if (!authClass.isLoggedIn) {
			setPendingNavigation({
				eventSlug: event.eventSlug
				// No market - just viewing the event
			})
			setShowRegisterDialog(true)
			return
		}
		navigate(`/event/${event.eventSlug}`)
	}, [navigate, event.eventSlug])

	const handleFirstOutcomeClick = useCallback((): void => {
		// Check if user is logged in
		if (!authClass.isLoggedIn) {
			setPendingNavigation({
				eventSlug: event.eventSlug,
				marketIndex: 0
			})
			setShowRegisterDialog(true)
			return
		}

		const market = event.eventMarkets[0]
		tradeClass.setSelectedMarketIndex(0)
		tradeClass.setMarketId(market.marketId)
		tradeClass.setSelectedClobToken(market.outcomes[0].clobTokenId)
		navigate(`/event/${event.eventSlug}`)
	}, [navigate, event.eventSlug, event.eventMarkets])

	const handleSecondOutcomeClick = useCallback((): void => {
		// Check if user is logged in
		if (!authClass.isLoggedIn) {
			setPendingNavigation({
				eventSlug: event.eventSlug,
				marketIndex: 1
			})
			setShowRegisterDialog(true)
			return
		}

		const market = event.eventMarkets[0]
		tradeClass.setSelectedMarketIndex(1)
		tradeClass.setMarketId(market.marketId)
		tradeClass.setSelectedClobToken(market.outcomes[1].clobTokenId)
		navigate(`/event/${event.eventSlug}`)
	}, [navigate, event.eventSlug, event.eventMarkets])

	const handleDialogClose = useCallback((open: boolean): void => {
		setShowRegisterDialog(open)
		if (!open) {
			setPendingNavigation(null)
		}
	}, [])

	// Get selected timeframe from events class
	const selectedTimeframe = useMemo((): keyof OutcomePriceHistories => {
		const market = event.eventMarkets[0]
		return market?.selectedTimeframe ?? "1d"
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event.eventSlug, event.eventMarkets[0]?.selectedTimeframe])
	const [isLoadingTimeframe, setIsLoadingTimeframe] = useState(false)

	// Get the First outcome
	const firstOutcome = useMemo((): SingleOutcome | undefined => {
		return event.eventMarkets[0]?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)
	}, [event])

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
		if (!firstOutcome) return

		// Check if already retrieving
		if (eventsClass.isRetrievingPriceHistory(event.eventSlug, firstOutcome.clobTokenId, timeframe)) {
			return
		}

		// Check if real historical data already exists (not just WebSocket updates)
		const existingData = firstOutcome.priceHistory[timeframe]
		if (existingData && hasRealHistoricalData(existingData)) {
			eventsClass.setSelectedTimeframe(event.eventSlug, timeframe)
			return
		}

		setIsLoadingTimeframe(true)
		eventsClass.setIsRetrievingPriceHistory(event.eventSlug, firstOutcome.clobTokenId, timeframe, true)
		try {
			const config = timeframeConfig[timeframe]
			const priceHistoryResponse = await retrieveOutcomePriceHistory({
				market: firstOutcome.clobTokenId as string,
				interval: config.interval,
				fidelity: config.fidelity
			})
			eventsClass.setOutcomePriceHistory(
				event.eventSlug,
				firstOutcome.clobTokenId,
				timeframe,
				priceHistoryResponse.history
			)
			eventsClass.setSelectedTimeframe(event.eventSlug, timeframe)
		} catch (error) {
			console.error(`Error retrieving price history for timeframe ${timeframe}:`, error)
			eventsClass.setIsRetrievingPriceHistory(event.eventSlug, firstOutcome.clobTokenId, timeframe, false)
		} finally {
			setIsLoadingTimeframe(false)
		}
	}, [firstOutcome, event.eventSlug, hasRealHistoricalData])

	// Handle timeframe button click
	const handleTimeframeClick = useCallback((timeframe: keyof OutcomePriceHistories): void => {
		if (isLoadingTimeframe) return
		void fetchTimeframeData(timeframe)
	}, [fetchTimeframeData, isLoadingTimeframe])

	return (
		<>
			<RegisterDialog
				open={showRegisterDialog}
				onOpenChange={handleDialogClose}
				pendingNavigation={pendingNavigation}
				event={event}
			/>
			<div
				className={cn(
					"rounded-lg p-4 hover:shadow-md transition-shadow",
					"bg-sidebar-blue aspect-615/175 flex flex-col border border-white/50"
				)}
			>
				<div className="flex gap-8 w-full flex-1 min-h-0">
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
								{(Math.round((event.eventMarkets[0].midpointPrice ?? 0) * 100) < 1 && (event.eventMarkets[0].midpointPrice ?? 0) > 0)
									? "< 1"
									: Math.round((event.eventMarkets[0].midpointPrice ?? 0) * 100)
								}%
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
								{event.eventMarkets[0].outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)?.outcome}
							</Button>
							<Button
								variant="default"
								size="sm"
								className="flex-1 bg-no-red hover:bg-no-red-hover rounded-[5px] text-button-text text-lg h-10"
								onClick={handleSecondOutcomeClick}
							>
								{event.eventMarkets[0].outcomes.find((outcome): boolean => outcome.outcomeIndex === 1)?.outcome}
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
		</>
	)
}

export default observer(SingleEventCard)
