"use client"

import { useEffect, useRef } from "react"
import { observer } from "mobx-react"
import { createChart, IChartApi, ISeriesApi, LineData, LineSeries, Time } from "lightweight-charts"

interface PriceHistoryChartProps {
	priceHistory: SinglePriceSnapshot[]
	multiplyBy100?: boolean // Whether to multiply values by 100 (for percentages). Defaults to true.
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
function PriceHistoryChart({ priceHistory, multiplyBy100 = true }: PriceHistoryChartProps): React.ReactNode {
	const chartContainerRef = useRef<HTMLDivElement>(null)
	const chartRef = useRef<IChartApi | null>(null)
	const seriesRef = useRef<ISeriesApi<"Line"> | null>(null)
	const watermarkStyleRef = useRef<HTMLStyleElement | null>(null)
	const tooltipRef = useRef<HTMLDivElement | null>(null)

	// Track price history length to detect changes (MobX observable arrays need explicit tracking)
	// Accessing .length ensures MobX tracks this property
	const priceHistoryLength = priceHistory?.length ?? 0

	// Initialize and update chart
	// eslint-disable-next-line max-lines-per-function
	useEffect((): (() => void) => {
		if (!chartContainerRef.current || !priceHistory || priceHistory.length === 0) {
			return (): void => {}
		}

		const chartLineColor = getCSSVariableAsRGB("--chart-line", "rgb(44, 145, 205)")
		const chartBackgroundColor = getCSSVariableAsRGB("--chart-background", "rgb(29, 42, 57)")
		const mutedForegroundColor = getCSSVariableAsRGB("--muted-foreground", "rgb(113, 113, 122)")
		// Grid line color
		const gridLineColor = "rgb(44, 63, 79)"
		// Calculate timezone offset for local time display
		const timezoneOffset = new Date().getTimezoneOffset() * 60 // Offset in seconds

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
				horzLines: {
					visible: true,
					color: gridLineColor,
					style: 1, // Dashed line style
				},
			},
			timeScale: {
				visible: true,
				timeVisible: true,
				secondsVisible: false,
				borderVisible: false,
				tickMarkFormatter: (time: Time, _tickMarkType: unknown, locale: string): string => {
					// Convert adjusted time back to UTC, then to local time for display
					const utcSeconds = Number(time) + timezoneOffset
					const date = new Date(utcSeconds * 1000)
					return date.toLocaleString(locale || "en-US", {
						hour: "numeric",
						minute: "2-digit",
						hour12: true, // Use 12-hour format with AM/PM
					})
				},
			},
			rightPriceScale: {
				visible: true,
				scaleMargins: {
					top: 0.1,
					bottom: 0.1,
				},
				ticksVisible: false, // Hide tick marks to reduce visual clutter
				borderVisible: false, // Hide the vertical border line
			},
			crosshair: {
				mode: 1, // Normal crosshair mode
				vertLine: {
					visible: true,
					width: 1,
					color: mutedForegroundColor,
					style: 0, // Solid line
				},
				horzLine: {
					visible: true,
					width: 1,
					color: mutedForegroundColor,
					style: 0, // Solid line
				},
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

		// Create line series with price format including %
		const lineSeries = chart.addSeries(LineSeries, {
			color: chartLineColor,
			lineWidth: 2,
			priceFormat: multiplyBy100 ? {
				type: "custom",
				minMove: 0.1,
				formatter: (price: number): string => {
					return `${price.toFixed(1)}%`
				},
			} : {
				type: "custom",
				minMove: 0.01,
				formatter: (price: number): string => {
					return `$${price.toFixed(2)}`
				},
			},
		})

		seriesRef.current = lineSeries

		// Convert price history to chart data format
		// Sort by timestamp and remove duplicates (keep last value for same timestamp)
		// Adjust timestamps for local timezone (lightweight-charts uses UTC internally)
		const chartDataMap = new Map<number, number>()

		priceHistory.forEach((snapshot): void => {
			// Convert to local time by adjusting for timezone offset
			// The chart displays UTC, so we adjust the timestamp to make it appear as local time
			const utcTime = new Date(snapshot.timestamp).getTime() / 1000
			const localTime = utcTime - timezoneOffset
			const value = multiplyBy100 ? snapshot.price * 100 : snapshot.price
			// Keep the last value for each timestamp
			chartDataMap.set(localTime, value)
		})

		const chartData: LineData<Time>[] = Array.from(chartDataMap.entries())
			.map(([time, value]): LineData<Time> => ({ time: time as Time, value }))
			.sort((a, b): number => Number(a.time) - Number(b.time))

		// Update chart data
		if (seriesRef.current) {
			seriesRef.current.setData(chartData)
			// Fit content
			chart.timeScale().fitContent()
		} else {
			lineSeries.setData(chartData)
			// Fit content
			chart.timeScale().fitContent()
		}

		// Configure price scale to show fewer grid lines
		// This reduces the frequency of horizontal grid lines
		chart.priceScale("right").applyOptions({
			ticksVisible: false,
			autoScale: true,
		})

		// Create tooltip element positioned at crosshair
		const tooltip = document.createElement("div")
		tooltip.className = "chart-tooltip"
		tooltip.style.cssText = `
			position: absolute;
			display: none;
			padding: 4px 8px;
			background: var(--chart-background, rgb(29, 42, 57));
			border: 1px solid var(--border, rgba(255, 255, 255, 0.2));
			border-radius: 4px;
			color: var(--foreground, rgb(255, 255, 255));
			font-size: 11px;
			pointer-events: none;
			z-index: 1000;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
			white-space: nowrap;
			transform: translate(-50%, -100%);
			margin-top: -8px;
		`
		if (chartContainerRef.current) {
			chartContainerRef.current.appendChild(tooltip)
			tooltipRef.current = tooltip
		}

		// Format timestamp for display (convert from UTC to local time)
		const formatTimestamp = (time: Time): string => {
			// time is in UTC seconds, but we adjusted it for local timezone display
			// So we need to add back the offset to get the actual UTC time, then convert to local
			const utcSeconds = Number(time) + timezoneOffset
			const date = new Date(utcSeconds * 1000)
			return date.toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})
		}

		// Subscribe to crosshair move events to position tooltip at crosshair
		chart.subscribeCrosshairMove((param): void => {
			if (!tooltipRef.current || !chartContainerRef.current || !param.point) {
				if (tooltipRef.current) {
					tooltipRef.current.style.display = "none"
				}
				return
			}

			const data = param.seriesData.get(lineSeries) as LineData<Time> | undefined
			if (!data || typeof data.value !== "number" || !param.time) {
				tooltipRef.current.style.display = "none"
				return
			}

			const price = data.value
			const timestamp = formatTimestamp(param.time)
			const formattedPrice = multiplyBy100
				? `${price.toFixed(1)}%`
				: `$${price.toFixed(2)}`
			tooltipRef.current.innerHTML = `
				<div style="font-weight: 600; margin-bottom: 2px;">${formattedPrice}</div>
				<div style="font-size: 10px; opacity: 0.8;">${timestamp}</div>
			`
			tooltipRef.current.style.display = "block"

			// Position tooltip at crosshair point (on the line)
			// param.point coordinates are relative to the chart container
			// Since container has position: relative, these coordinates work directly
			const x = param.point.x
			const y = param.point.y
			tooltipRef.current.style.left = `${x}px`
			tooltipRef.current.style.top = `${y}px`
		})

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
			if (tooltipRef.current && tooltipRef.current.parentNode) {
				tooltipRef.current.parentNode.removeChild(tooltipRef.current)
			}
			if (chart) {
				chart.remove()
			}
		}
	}, [priceHistory, priceHistoryLength, multiplyBy100])

	return (
		<div className="w-full h-full relative" ref={chartContainerRef} />
	)
}

export default observer(PriceHistoryChart)
