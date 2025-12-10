"use client"

import { useEffect, useRef } from "react"
import { createChart, IChartApi, ISeriesApi, LineData, LineSeries, Time } from "lightweight-charts"

interface PriceHistoryChartProps {
	priceHistory: SinglePriceSnapshot[]
}

// Convert CSS variable to RGB format that lightweight-charts understands
function getCSSVariableAsRGB(variable: string, fallback: string): string {
	try {
		// Create a temporary element and use the CSS variable directly
		// This converts any CSS color format (lab, oklch, rgb, etc.) to rgb()
		const tempEl = document.createElement("div")
		// Use the CSS variable directly via var()
		tempEl.style.setProperty("color", `var(${variable}, ${fallback})`)
		// Make it invisible but still in the DOM for computed style
		tempEl.style.position = "absolute"
		tempEl.style.visibility = "hidden"
		tempEl.style.pointerEvents = "none"
		tempEl.style.width = "1px"
		tempEl.style.height = "1px"
		tempEl.style.top = "-9999px"
		document.body.appendChild(tempEl)

		// Force a reflow to ensure styles are computed

		tempEl.offsetHeight

		const computedColor = window.getComputedStyle(tempEl).color
		document.body.removeChild(tempEl)

		// Use canvas to ensure we get a valid RGB value
		// This handles cases where browser returns lab() or other formats
		const canvas = document.createElement("canvas")
		canvas.width = 1
		canvas.height = 1
		const ctx = canvas.getContext("2d")
		if (ctx) {
			ctx.fillStyle = computedColor || fallback
			ctx.fillRect(0, 0, 1, 1)
			const imageData = ctx.getImageData(0, 0, 1, 1)
			const [r, g, b] = imageData.data
			return `rgb(${r}, ${g}, ${b})`
		}

		// Fallback: return computed color if it's already in rgb format
		if (computedColor && computedColor.startsWith("rgb")) {
			return computedColor
		}
	} catch (error) {
		// If conversion fails, use fallback
		console.warn(`Failed to convert CSS variable ${variable} to RGB:`, error)
	}
	return fallback
}

// eslint-disable-next-line max-lines-per-function
export default function PriceHistoryChart({ priceHistory }: PriceHistoryChartProps): React.ReactNode {
	const chartContainerRef = useRef<HTMLDivElement>(null)
	const chartRef = useRef<IChartApi | null>(null)
	const seriesRef = useRef<ISeriesApi<"Line"> | null>(null)
	const watermarkStyleRef = useRef<HTMLStyleElement | null>(null)

	useEffect((): (() => void) => {
		if (!chartContainerRef.current || !priceHistory || priceHistory.length === 0) {
			return (): void => {}
		}

		const chartLineColor = getCSSVariableAsRGB("--chart-line", "rgb(44, 145, 205)")
		const chartBackgroundColor = getCSSVariableAsRGB("--chart-background", "rgb(29, 42, 57)")
		const mutedForegroundColor = getCSSVariableAsRGB("--muted-foreground", "rgb(113, 113, 122)")

		// Create chart
		const chart = createChart(chartContainerRef.current, {
			width: chartContainerRef.current.clientWidth,
			height: chartContainerRef.current.clientHeight,
			layout: {
				background: { color: chartBackgroundColor },
				textColor: mutedForegroundColor,
				attributionLogo: false,
			},
			grid: {
				vertLines: { visible: false },
				horzLines: { visible: false },
			},
			timeScale: {
				visible: false,
			},
			rightPriceScale: {
				visible: false,
			},
			handleScroll: {
				mouseWheel: false,
				pressedMouseMove: false,
			},
			handleScale: {
				axisPressedMouseMove: false,
				mouseWheel: false,
				pinch: false,
			},
		})

		chartRef.current = chart

		// Create line series
		const lineSeries = chart.addSeries(LineSeries, {
			color: chartLineColor,
			lineWidth: 2,
		})

		seriesRef.current = lineSeries

		// Convert price history to chart data format
		// Sort by timestamp and remove duplicates (keep last value for same timestamp)
		const chartDataMap = new Map<number, number>()

		priceHistory.forEach((snapshot): void => {
			const time = new Date(snapshot.timestamp).getTime() / 1000
			const value = snapshot.price * 100 // Convert to percentage
			// Keep the last value for each timestamp
			chartDataMap.set(time, value)
		})

		const chartData: LineData<Time>[] = Array.from(chartDataMap.entries())
			.map(([time, value]): LineData<Time> => ({ time: time as Time, value }))
			.sort((a, b): number => Number(a.time) - Number(b.time))

		lineSeries.setData(chartData)

		// Fit content
		chart.timeScale().fitContent()

		// Hide TradingView logo/watermark via CSS (fallback if attributionLogo doesn't work)
		if (chartContainerRef.current) {
			const style = document.createElement("style")
			style.textContent = `
				.tv-lightweight-charts-watermark,
				[class*="watermark"],
				[class*="attribution"],
				[class*="logo"] {
					display: none !important;
					visibility: hidden !important;
					opacity: 0 !important;
				}
			`
			chartContainerRef.current.appendChild(style)
			watermarkStyleRef.current = style

			// Also try to find and hide the watermark element directly with multiple selectors
			const hideWatermark = (): void => {
				if (chartContainerRef.current) {
					const selectors = [
						".tv-lightweight-charts-watermark",
						"[class*='watermark']",
						"[class*='attribution']",
						"[class*='logo']",
						"a[href*='tradingview']",
					]
					selectors.forEach((selector): void => {
						const elements = chartContainerRef.current?.querySelectorAll(selector)
						elements?.forEach((el): void => {
							if (el instanceof HTMLElement) {
								el.style.display = "none"
								el.style.visibility = "hidden"
								el.style.opacity = "0"
							}
						})
					})
				}
			}

			// Try multiple times to catch dynamically added elements
			hideWatermark()
			setTimeout(hideWatermark, 50)
			setTimeout(hideWatermark, 200)
			setTimeout(hideWatermark, 500)
		}

		// Handle resize
		const handleResize = (): void => {
			if (chartContainerRef.current && chart) {
				chart.applyOptions({
					width: chartContainerRef.current.clientWidth,
					height: chartContainerRef.current.clientHeight,
				})
			}
		}

		window.addEventListener("resize", handleResize)

		// Cleanup
		return (): void => {
			window.removeEventListener("resize", handleResize)
			if (watermarkStyleRef.current && watermarkStyleRef.current.parentNode) {
				watermarkStyleRef.current.parentNode.removeChild(watermarkStyleRef.current)
			}
			if (chart) {
				chart.remove()
			}
		}
	}, [priceHistory])

	return (
		<div className="w-full h-full" ref={chartContainerRef} />
	)
}
