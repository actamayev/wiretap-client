"use client"
import { ReactNode, useEffect } from "react"
import useInitializeGoogleAnalytics from "../src/hooks/use-initialize-google-analytics"
import { GoogleOAuthProvider } from "@react-oauth/google"
import authClass from "../src/classes/auth-class"
import personalInfoClass from "../src/classes/personal-info-class"
import retrievePersonalInfo from "../src/utils/personal-info/retrieve-personal-info"
import retrieveAllFunds from "../src/utils/funds/retrieve-all-funds"
import polymarketWebSocketClient from "../src/classes/polymarket-websocket-client"

const retrieveInfo = async (): Promise<void> => {
	// Only retrieve if user is authenticated but we don't have personal info yet
	// This handles page refreshes where middleware knows user is auth but client state is empty
	if (!authClass.isLoggedIn || personalInfoClass.retrievedPersonalInfo) return
	try {
		await retrievePersonalInfo()
		await retrieveAllFunds()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		// If this fails, user might not actually be authenticated
		console.error("Data retrieval failed - user may not be authenticated")
	}
}

export default function Providers({ children }: { children: ReactNode }): React.ReactNode {
	useInitializeGoogleAnalytics()

	// Smart data retrieval - only if needed
	useEffect((): void => {
		void retrieveInfo()
	}, [])

	// Connect to Polymarket WebSocket when user is logged in (without any tokens initially)
	useEffect((): void => {
		// Connect if not already connected
		if (!polymarketWebSocketClient.isWebSocketConnected()) {
			// Connect with empty array - tokens will be added as events are retrieved
			void polymarketWebSocketClient.connect([]).catch((error): void => {
				console.error("Failed to connect to Polymarket WebSocket:", error)
			})
		}
	}, [])

	return (
		<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
			{children}
		</GoogleOAuthProvider>
	)
}
