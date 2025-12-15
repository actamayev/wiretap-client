"use client"

import isEmpty from "lodash-es/isEmpty"

export default function confirmLoginFields(credentials: IncomingAuthRequest, setError: (error: string) => void): boolean {
	if (isEmpty(credentials.email) && isEmpty(credentials.password)) {
		setError("Welcome back! Please enter your email and password to log in")
		return false
	} else if (isEmpty(credentials.password)) {
		setError("Almost there! Just need your password")
		return false
	} else if (isEmpty(credentials.email)) {
		setError("To get started, enter your email")
		return false
	} else if (credentials.email.length < 3) {
		setError("Please enter a longer email (at least 3 characters)")
		return false
	} else if (credentials.password.length < 6) {
		setError("For better security, please use at least 6 characters for your password")
		return false
	} else {
		setError("")
		return true
	}
}
