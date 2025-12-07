"use client"

import { useState, useMemo, useEffect } from "react"
import { observer } from "mobx-react"
import { ArrowUp } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import eventsClass from "../../classes/events-class"
import isUndefined from "lodash-es/isUndefined"
import InternalContainerLayout from "../layouts/internal-container-layout"
import retrieveSingleEvent from "../../utils/events/retrieve-single-event"

interface SingleEventPageProps {
	eventSlug: EventSlug
}

type Timeframe = "1H" | "6H" | "1D" | "1W" | "1M" | "ALL"
type TradeTab = "Buy" | "Sell"

function PriceChart({ seed, timeframe }: { seed: string; timeframe: Timeframe }): React.ReactNode {
	const dataPoints = useMemo((): number[] => {
		// Generate deterministic data based on seed and timeframe
		let hash = 0
		const combinedSeed = `${seed}-${timeframe}`
		for (let i = 0; i < combinedSeed.length; i++) {
			hash = ((hash << 5) - hash) + combinedSeed.charCodeAt(i)
			hash = hash & hash
		}
		const random = (): number => {
			hash = ((hash << 5) - hash) + 1
			return (hash & 0x7fffffff) / 0x7fffffff
		}

		// eslint-disable-next-line no-nested-ternary
		const pointCount = timeframe === "ALL" ? 30 : timeframe === "1M" ? 20 : timeframe === "1W" ? 15 : 10
		return Array.from({ length: pointCount }, (_, i): number => {
			const base = 60 + random() * 20
			const variation = Math.sin(i * 0.3 + random() * 2) * 15 + random() * 10
			return Math.max(0, Math.min(100, base + variation))
		})
	}, [seed, timeframe])

	const maxValue = Math.max(...dataPoints)
	const minValue = Math.min(...dataPoints)
	const range = maxValue - minValue || 1

	const width = 800
	const height = 300
	const padding = 40
	const chartWidth = width - padding * 2
	const chartHeight = height - padding * 2

	const points = dataPoints.map((value, index): string => {
		const x = padding + (index / (dataPoints.length - 1)) * chartWidth
		const y = padding + chartHeight - ((value - minValue) / range) * chartHeight
		return `${x},${y}`
	}).join(" ")

	// Generate month labels for x-axis
	const monthLabels = ["Aug", "Sep", "Oct", "Nov", "Dec"]

	return (
		<div className="w-full">
			<svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
				{/* Y-axis labels */}
				{Array.from({ length: 5 }, (_, i): React.ReactNode => {
					const y = padding + (i / 4) * chartHeight
					const value = minValue + (range * (1 - i / 4))
					return (
						<text
							key={`y-${i}`}
							x={padding - 10}
							y={y + 4}
							textAnchor="end"
							className="text-xs fill-muted-foreground"
						>
							{Math.round(value)}%
						</text>
					)
				})}

				{/* X-axis labels */}
				{monthLabels.map((month, i): React.ReactNode => {
					const x = padding + (i / (monthLabels.length - 1)) * chartWidth
					return (
						<text
							key={`x-${i}`}
							x={x}
							y={height - padding + 20}
							textAnchor="middle"
							className="text-xs fill-muted-foreground"
						>
							{month}
						</text>
					)
				})}

				{/* Chart line */}
				<polyline
					points={points}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="text-primary"
				/>

				{/* Current point */}
				<circle
					cx={padding + chartWidth}
					cy={padding + chartHeight - ((dataPoints[dataPoints.length - 1] - minValue) / range) * chartHeight}
					r="4"
					className="fill-primary"
				/>
			</svg>
		</div>
	)
}

// eslint-disable-next-line max-lines-per-function
function SingleEventPage({ eventSlug }: SingleEventPageProps): React.ReactNode {
	const [timeframe, setTimeframe] = useState<Timeframe>("ALL")
	const [tradeTab, setTradeTab] = useState<TradeTab>("Buy")
	const [amount, setAmount] = useState("")
	const [selectedMarket, setSelectedMarket] = useState<OutcomeString>("Yes" as OutcomeString)

	useEffect((): void => {
		void retrieveSingleEvent(eventSlug)
	}, [eventSlug])

	const event = useMemo((): SingleEvent | undefined => {
		return eventsClass.events.get(eventSlug)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, eventsClass.events.size])

	useEffect((): void => {
		if (event) {
			document.title = `${event.eventTitle} | Wiretap`
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event?.eventTitle])

	if (isUndefined(event)) {
		return (
			<div className="flex items-center justify-center h-full">
				<div>Loading...</div>
			</div>
		)
	}

	// Dummy data
	const currentProbability = 99
	const probabilityChange = 35
	const totalVolume = 33215269
	const resolutionDate = "Dec 31, 2025"
	const yesPrice = 0.993
	const noPrice = 0.008
	const balance = 0

	const timeframes: Timeframe[] = ["1H", "6H", "1D", "1W", "1M", "ALL"]

	const formatCurrency = (value: number): string => {
		if (value >= 1000000) {
			return `$${(value / 1000000).toFixed(2)}M`
		}
		if (value >= 1000) {
			return `$${(value / 1000).toFixed(2)}K`
		}
		return `$${value.toFixed(2)}`
	}

	const formatPrice = (price: number): string => {
		return `${(price * 100).toFixed(1)}¢`
	}

	return (
		<InternalContainerLayout preventElasticScroll={true}>
			<div className="flex gap-6 h-full p-6">
				{/* Left Section - Event Details and Chart */}
				<div className="flex-3 flex flex-col gap-6">
					{/* Event Header */}
					<div className="flex items-start gap-3">
						<div className="w-10 h-10 shrink-0 rounded-md bg-muted flex items-center justify-center text-foreground">
							M
						</div>
						<div className="flex-1">
							<h1 className="text-2xl font-semibold mb-2">{event.eventTitle}</h1>
							<div className="flex items-center gap-4 text-sm text-muted-foreground">
								<span>{formatCurrency(totalVolume)} Vol.</span>
								<span>•</span>
								<span>Resolution {resolutionDate}</span>
							</div>
						</div>
					</div>

					{/* Current Probability */}
					<div className="flex items-baseline gap-2">
						<span className="text-5xl font-bold">{currentProbability}%</span>
						<span className="text-sm text-muted-foreground">chance</span>
						<div className="flex items-center gap-1 text-green-600">
							<ArrowUp className="h-4 w-4" />
							<span className="text-sm font-medium">{probabilityChange}%</span>
						</div>
					</div>

					{/* Chart */}
					<div className="flex-1 min-h-0">
						<div className="bg-card border border-border rounded-lg p-4 h-full">
							<PriceChart seed={eventSlug} timeframe={timeframe} />
						</div>
					</div>

					{/* Timeframe Selector */}
					<div className="flex gap-2">
						{timeframes.map((tf): React.ReactNode => (
							<Button
								key={tf}
								variant={timeframe === tf ? "default" : "outline"}
								size="sm"
								onClick={(): void => setTimeframe(tf)}
							>
								{tf}
							</Button>
						))}
					</div>
				</div>

				{/* Right Section - Trading Interface and Related Markets */}
				<div className="flex-2 flex flex-col gap-6">
					{/* Trading Panel */}
					<div className="bg-card border border-border rounded-lg p-4">
						{/* Tabs */}
						<div className="flex gap-2 mb-4">
							<Button
								variant={tradeTab === "Buy" ? "default" : "ghost"}
								size="sm"
								onClick={(): void => setTradeTab("Buy")}
								className="flex-1"
							>
								Buy
							</Button>
							<Button
								variant={tradeTab === "Sell" ? "default" : "ghost"}
								size="sm"
								onClick={(): void => setTradeTab("Sell")}
								className="flex-1"
							>
								Sell
							</Button>
						</div>

						{/* Yes/No Buttons */}
						<div className="flex gap-2 mb-4">
							<Button
								variant={selectedMarket === "Yes" ? "default" : "outline"}
								className={cn(
									"flex-1 h-12",
									selectedMarket === "Yes" ? "bg-green-600 hover:bg-green-700 text-white" : ""
								)}
								onClick={(): void => setSelectedMarket("Yes" as OutcomeString)}
							>
								<div className="flex items-center justify-between w-full">
									<span className="font-semibold">Yes</span>
									<span className="text-xs opacity-90">{formatPrice(yesPrice)}</span>
								</div>
							</Button>
							<Button
								variant={selectedMarket === "No" ? "default" : "outline"}
								className={cn(
									"flex-1 h-12",
									selectedMarket === "No" ? "bg-gray-600 hover:bg-gray-700 text-white" : ""
								)}
								onClick={(): void => setSelectedMarket("No" as OutcomeString)}
							>
								<div className="flex items-center justify-between w-full">
									<span className="font-semibold">No</span>
									<span className="text-xs opacity-90">{formatPrice(noPrice)}</span>
								</div>
							</Button>
						</div>

						{/* Amount Input */}
						<div className="mb-4">
							<div className="text-xs text-muted-foreground mb-1">Amount</div>
							<div className="text-xs text-muted-foreground mb-2">Balance {formatCurrency(balance)}</div>
							<Input
								type="number"
								placeholder="$0"
								value={amount}
								onChange={(e): void => setAmount(e.target.value)}
								className="mb-2"
							/>
						</div>

						{/* Action Button */}
						<Button
							variant="default"
							className="w-full bg-gray-600 hover:bg-gray-700 text-white"
						>
							Trade
						</Button>
					</div>
				</div>
			</div>
		</InternalContainerLayout>
	)
}

export default observer(SingleEventPage)

