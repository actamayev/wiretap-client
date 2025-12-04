"use client"

export function handleTypeUsername(event: React.ChangeEvent<HTMLInputElement>) : string {
	try {
		const newValue = event.target.value
		// Regex to remove any  % / ? # [ ] @ ! $ & ' ( ) * + , ; = ^ characters

		return newValue.replace(/[\/\?%#@\[\]!$&'()*+,;=^]/g, "")
	} catch (error) {
		console.error(error)
		return ""
	}
}

export function handleTypeNumber(event: React.ChangeEvent<HTMLInputElement>) : string {
	try {
		const newValue = event.target.value
		// Only allow numeric characters and limit to reasonable age range (1-3 digits)
		const numericOnly = newValue.replace(/[^0-9]/g, "")

		return numericOnly
	} catch (error) {
		console.error(error)
		return ""
	}
}
