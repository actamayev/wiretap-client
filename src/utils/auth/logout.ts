"use client"

import authClass from "../../classes/auth-class"
import personalInfoClass from "../../classes/personal-info-class"
import fundsClass from "../../classes/funds-class"

export default function logout(): void {
	authClass.setLoggingOut(true)

	try {
		authClass.logout()
		personalInfoClass.logout()
		fundsClass.logout()
	} catch (error) {
		console.error("Logout error:", error)
	} finally {
		authClass.setLoggingOut(false)
		personalInfoClass.logout()
		fundsClass.logout()
	}
}
