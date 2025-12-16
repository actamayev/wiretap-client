// Convert CSS variable to RGB format that lightweight-charts understands
export default function getCSSVariableAsRGB(variable: string, fallback: string): string {
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
