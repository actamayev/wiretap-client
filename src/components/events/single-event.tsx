"use client"

import { useMemo } from "react"
import { Button } from "../ui/button"
import useTypedNavigate from "../../hooks/navigate/use-typed-navigate"

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
		<svg width={width} height={height} className="w-full h-full">
			<polyline
				points={points}
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				className="text-primary"
			/>
		</svg>
	)
}

function SingleEvent({ event }: SingleEventProps): React.ReactNode {
	const navigate = useTypedNavigate()
	// Dummy data
	const yesPercentage = 65
	const volume = 33 // in millions

	return (
		<div
			onClick={(): void => navigate(`/events/${event.eventUUID}`)}
			className="cursor-pointer border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
		>
			<div className="flex gap-4 w-full">
				{/* Left Section - 3/5 width */}
				<div className="w-3/5 flex flex-col gap-4">
					{/* Row 1: Image, Name, Percentage */}
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted">
							<div className="w-full h-full flex items-center justify-center text-muted-foreground">
								📊
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-sm truncate">{event.eventName}</h3>
						</div>
						<div className="shrink-0 text-lg font-bold text-primary">
							{yesPercentage}%
						</div>
					</div>

					{/* Row 2: Yes/No Buttons */}
					<div className="flex gap-2">
						<Button
							variant="default"
							size="sm"
							className="flex-1 bg-green-600 hover:bg-green-700 text-white"
							onClick={(e): void => {
								e.stopPropagation()
								navigate(`/events/${event.eventUUID}`)
							}}
						>
							Yes
						</Button>
						<Button
							variant="default"
							size="sm"
							className="flex-1 bg-red-600 hover:bg-red-700 text-white"
							onClick={(e): void => {
								e.stopPropagation()
								navigate(`/events/${event.eventUUID}`)
							}}
						>
							No
						</Button>
					</div>

					{/* Row 3: Volume */}
					<div className="text-sm text-muted-foreground">
						${volume}m vol
					</div>
				</div>

				{/* Right Section - 2/5 width */}
				<div className="w-2/5 flex items-center justify-center">
					<SimpleChart seed={event.eventUUID} />
				</div>
			</div>
		</div>
	)
}

export default SingleEvent
