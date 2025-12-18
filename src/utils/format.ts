export function formatVolume(volume: number): string {
	if (volume >= 1_000_000_000) {
		const billions = volume / 1_000_000_000
		return `$${billions.toFixed(1)}b Vol.`
	}

	if (volume >= 1_000_000) {
		const millions = volume / 1_000_000
		return `$${millions.toFixed(0)}m Vol.`
	}

	if (volume >= 1_000) {
		const thousands = volume / 1_000
		return `$${thousands.toFixed(1)}k Vol.`
	}

	return `$${volume.toFixed(0)} Vol.`
}

export function formatCurrency(value: number): string {
	return value.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})
}

/**
 * Formats a probability/percentage value (0-1 range) to a string representation
 * @param probability - A value between 0 and 1 representing the probability
 * @returns A formatted string: ">99" for >= 99.5%, "< 1" for < 1% and > 0%, or rounded percentage otherwise
 */
export function formatPercentage(probability: number | null | undefined): string {
	const percentage = (probability ?? 0) * 100
	if (percentage >= 99.5) return ">99"
	if (percentage < 1) return "< 1"
	return Math.round(percentage).toString()
}
