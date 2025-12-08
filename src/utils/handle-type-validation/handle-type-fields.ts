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
