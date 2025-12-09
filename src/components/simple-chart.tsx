"use client"

import { useMemo } from "react"

export default function SimpleChart({ seed }: { seed: string }): React.ReactNode {
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
