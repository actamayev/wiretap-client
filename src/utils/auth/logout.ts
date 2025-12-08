"use client"

import authClass from "../../classes/auth-class"
import personalInfoClass from "../../classes/personal-info-class"
import fundsClass from "../../classes/funds-class"
import eventsClass from "../../classes/events-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import tradeClass from "../../classes/trade-class"

export default async function logout(): Promise<void> {
	authClass.setLoggingOut(true)

	try {
		await wiretapApiClient.authDataService.logout()
		authClass.logout()
		personalInfoClass.logout()
		fundsClass.logout()
		eventsClass.logout()
		tradeClass.logout()
	} catch (error) {
		console.error("Logout error:", error)
		authClass.setLoggingOut(false)
		personalInfoClass.logout()
		fundsClass.logout()
		eventsClass.logout()
		tradeClass.logout()
	} finally {
		authClass.setLoggingOut(false)
	}
}
