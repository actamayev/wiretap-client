"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { observer } from "mobx-react"
import Image from "next/image"
import { ChevronDown, Clock } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import CustomTooltip from "../custom-tooltip"
import TradeCard from "./trade-card"
import eventsClass from "../../classes/events-class"
import tradeClass from "../../classes/trade-class"
import isUndefined from "lodash-es/isUndefined"
import InternalContainerLayout from "../layouts/internal-container-layout"
import retrieveSingleEvent from "../../utils/events/retrieve-single-event"
import authClass from "../../classes/auth-class"

interface SingleEventPageProps {
	eventSlug: EventSlug
}

type Timeframe = "1H" | "6H" | "1D" | "1W" | "1M" | "ALL"

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
	const [rulesExpanded, setRulesExpanded] = useState(false)
	const [rulesMaxHeight, setRulesMaxHeight] = useState<number | undefined>(undefined)
	const chartRef = useRef<HTMLDivElement>(null)
	const rulesRef = useRef<HTMLDivElement>(null)

	useEffect((): void => {
		void retrieveSingleEvent(eventSlug)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, authClass.isFinishedWithSignup])

	const event = useMemo((): SingleEvent | undefined => {
		return eventsClass.events.get(eventSlug)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventSlug, eventsClass.events.size])

	// Dummy data - these should eventually come from the event or API
	const yesPrice = 0.993
	const noPrice = 0.008
	const balance = 0

	// Update trade class with prices when event is available
	useEffect((): void => {
		if (event) {
			tradeClass.setPrices(yesPrice, noPrice)
			tradeClass.setBalance(balance)
		}
	}, [event])

	useEffect((): void => {
		if (event) {
			document.title = `${event.eventTitle} | Wiretap`
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event?.eventTitle])

	// Calculate max height for rules based on chart height
	useEffect((): () => void => {
		const updateRulesHeight = (): void => {
			if (chartRef.current && !rulesExpanded) {
				const chartHeight = chartRef.current.offsetHeight
				setRulesMaxHeight(chartHeight)
			} else {
				setRulesMaxHeight(undefined)
			}
		}

		updateRulesHeight()
		window.addEventListener("resize", updateRulesHeight)
		return () => {
			window.removeEventListener("resize", updateRulesHeight)
		}
	}, [rulesExpanded])

	if (isUndefined(event)) {
		return (
			<div className="flex items-center justify-center h-full">
				<div>Loading...</div>
			</div>
		)
	}

	const timeframes: Timeframe[] = ["1H", "6H", "1D", "1W", "1M", "ALL"]


	const formatDate = (date: Date): string => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		}).format(new Date(date))
	}

	return (
		<InternalContainerLayout preventElasticScroll={true}>
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
						<h1 className="text-2xl font-semibold">{event.eventTitle}</h1>
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
						<div ref={chartRef} className="flex-1 min-h-0">
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

					{/* Right Section - Trading Interface and Rules */}
					<div className="flex-1 flex flex-col gap-6 min-h-0">
						<TradeCard />

						{/* Rules Section */}
						<div className="bg-card border border-border rounded-lg p-4 flex flex-col min-h-0">
							<div className="flex items-center justify-between mb-3">
								<h3 className="font-semibold">Rules</h3>
							</div>
							<div
								ref={rulesRef}
								className={cn(
									"text-sm text-muted-foreground overflow-hidden transition-all",
									!rulesExpanded && rulesMaxHeight ? "" : ""
								)}
								style={
									!rulesExpanded && rulesMaxHeight
										? { maxHeight: `${rulesMaxHeight}px`, overflowY: "hidden" }
										: {}
								}
							>
								{event.eventDescription || "No rules specified for this event."}
							</div>
							{!rulesExpanded && rulesMaxHeight && (
								<Button
									variant="ghost"
									size="sm"
									onClick={(): void => setRulesExpanded(true)}
									className="mt-2 self-start flex items-center gap-1"
								>
									Show More
									<ChevronDown className="h-4 w-4" />
								</Button>
							)}
							{rulesExpanded && (
								<Button
									variant="ghost"
									size="sm"
									onClick={(): void => setRulesExpanded(false)}
									className="mt-2 self-start flex items-center gap-1"
								>
									Show Less
									<ChevronDown className="h-4 w-4 rotate-180" />
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</InternalContainerLayout>
	)
}

export default observer(SingleEventPage)

