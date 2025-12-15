import { headers } from 'next/headers'

export interface AuthState {
	userId: number | null
}

export async function getAuthState(): Promise<AuthState> {
	const headersList = await headers()

	// Get consolidated auth data from middleware
	const authDataHeader = headersList.get('x-auth-data')
	
	if (authDataHeader) {
		try {
			const authData = JSON.parse(authDataHeader)
			return { userId: authData.userId }
		} catch (error) {
			console.error("Failed to parse auth data header:", error)
		}
	}
	return { userId: null }
}