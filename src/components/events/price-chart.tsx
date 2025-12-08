"use client"

import { useMemo } from "react"

export type Timeframe = "1H" | "6H" | "1D" | "1W" | "1M" | "ALL"

interface PriceChartProps {
	seed: string
	timeframe: Timeframe
}

export default function PriceChart({ seed, timeframe }: PriceChartProps): React.ReactNode {
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
				{/* Background */}
				<rect width={width} height={height} fill="var(--chart-background)" />

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
					stroke="var(--chart-line)"
					strokeWidth="2"
				/>

				{/* Current point */}
				<circle
					cx={padding + chartWidth}
					cy={padding + chartHeight - ((dataPoints[dataPoints.length - 1] - minValue) / range) * chartHeight}
					r="4"
					fill="var(--chart-line)"
				/>
			</svg>
		</div>
	)
}
