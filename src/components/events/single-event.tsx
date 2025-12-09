"use client"

import { useMemo, useCallback } from "react"
import { Button } from "../ui/button"
import useTypedNavigate from "../../hooks/navigate/use-typed-navigate"
import Image from "next/image"
import { formatVolume } from "../../utils/format"
import tradeClass from "../../classes/trade-class"
import { observer } from "mobx-react"

interface SingleEventProps {
	event: SingleEvent
}

function SimpleChart({ seed }: { seed: string }): React.ReactNode {
	// Generate deterministic dummy data based on seed
	const dataPoints = useMemo((): number[] => {
		// Simple hash function for deterministic randomness
		let hash = 0
		for (let i = 0; i < seed.length; i++) {
			hash = ((hash << 5) - hash) + seed.charCodeAt(i)
			hash = hash & hash
		}
		const random = (): number => {
			hash = ((hash << 5) - hash) + 1
			return (hash & 0x7fffffff) / 0x7fffffff
		}

		return Array.from({ length: 20 }, (_, i): number =>
			50 + Math.sin(i * 0.3 + random() * 2) * 20 + random() * 10
		)
	}, [seed])
	const maxValue = Math.max(...dataPoints)
	const minValue = Math.min(...dataPoints)
	const range = maxValue - minValue || 1

	const width = 200
	const height = 100
	const padding = 10
	const chartWidth = width - padding * 2
	const chartHeight = height - padding * 2

	const points = dataPoints.map((value, index): string => {
		const x = padding + (index / (dataPoints.length - 1)) * chartWidth
		const y = padding + chartHeight - ((value - minValue) / range) * chartHeight
		return `${x},${y}`
	}).join(" ")

	return (
		<svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
			<rect width={width} height={height} fill="var(--chart-background)" />
			<polyline
				points={points}
				fill="none"
				stroke="var(--chart-line)"
				strokeWidth="2"
			/>
		</svg>
	)
}

function SingleEvent({ event }: SingleEventProps): React.ReactNode {
	const navigate = useTypedNavigate()

	const handleTitleClick = useCallback((): void => {
		navigate(`/events/${event.eventSlug}`)
	}, [navigate, event.eventSlug])

	const handleYesClick = useCallback((): void => {
		const market = event.eventMarkets[0]
		tradeClass.setSelectedMarket("Yes" as OutcomeString)
		tradeClass.setMarketId(market.marketId)
		tradeClass.setMarketQuestion(market.marketQuestion)
		tradeClass.setSelectedClobToken(market.clobTokens[0])
		navigate(`/events/${event.eventSlug}`)
	}, [navigate, event.eventSlug, event.eventMarkets])

	const handleNoClick = useCallback((): void => {
		const market = event.eventMarkets[0]
		tradeClass.setSelectedMarket("No" as OutcomeString)
		tradeClass.setMarketId(market.marketId)
		tradeClass.setMarketQuestion(market.marketQuestion)
		tradeClass.setSelectedClobToken(market.clobTokens[1])
		navigate(`/events/${event.eventSlug}`)
	}, [navigate, event.eventSlug, event.eventMarkets])

	return (
		<div className="rounded-lg p-4 hover:shadow-md transition-shadow bg-sidebar-blue aspect-615/175 flex flex-col">
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
							{Math.round((event.eventMarkets[0].lastTradePrice ?? 0) * 100)}%
						</div>
					</div>

					{/* Row 2: Yes/No Buttons */}
					<div className="flex gap-4">
						<Button
							variant="default"
							size="sm"
							className="flex-1 bg-yes-green hover:bg-yes-green-hover rounded-[5px] text-button-text text-lg h-10"
							onClick={handleYesClick}
						>
							Yes
						</Button>
						<Button
							variant="default"
							size="sm"
							className="flex-1 bg-no-red hover:bg-no-red-hover rounded-[5px] text-button-text text-lg h-10"
							onClick={handleNoClick}
						>
							No
						</Button>
					</div>

					{/* Row 3: Volume */}
					<div className="text-sm text-volume-text">
						{formatVolume(event.eventTotalVolume)}
					</div>
				</div>

				{/* Right Section - 2/5 width */}
				<div className="w-2/5 flex flex-col h-full min-h-0">
					<div className="flex-1 min-h-0 rounded-[5px] overflow-hidden">
						<SimpleChart seed={event.eventSlug} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default observer(SingleEvent)
