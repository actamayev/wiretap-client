export default function formatVolume(volume: number): string {
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
