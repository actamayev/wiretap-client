"use client"

import authClass from "../../classes/auth-class"
import personalInfoClass from "../../classes/personal-info-class"
import fundsClass from "../../classes/funds-class"
import eventsClass from "../../classes/events-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"

export default async function logout(): Promise<void> {
	authClass.setLoggingOut(true)

	try {
		await wiretapApiClient.authDataService.logout()
		authClass.logout()
		personalInfoClass.logout()
		fundsClass.logout()
		eventsClass.logout()
	} catch (error) {
		console.error("Logout error:", error)
		authClass.setLoggingOut(false)
		personalInfoClass.logout()
		fundsClass.logout()
		eventsClass.logout()
	} finally {
		authClass.setLoggingOut(false)
	}
}
