import { headers } from 'next/headers'

export async function getAuthState(): Promise<number | null> {
	const headersList = await headers()

	// Get consolidated auth data from middleware
	const authDataHeader = headersList.get('x-auth-data')
	
	if (authDataHeader) {
		try {
			const authData = JSON.parse(authDataHeader)
			return authData.userId
		} catch (error) {
			console.error("Failed to parse auth data header:", error)
		}
	}
	return null
}
