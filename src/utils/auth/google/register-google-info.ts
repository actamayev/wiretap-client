"use client"

import isEqual from "lodash-es/isEqual"
import authClass from "../../../classes/auth-class"
import { isNonSuccessResponse } from "../../type-checks"
import personalInfoClass from "../../../classes/personal-info-class"
import wiretapApiClient from "../../../classes/wiretap-api-client-class"
import setErrorAxiosResponse from "../../error-handling/set-error-axios-response"
import fundsClass from "../../../classes/funds-class"

export default async function registerGoogleInfo(
	googleInfo: NewGoogleInfoFormValues,
	setError: (error: string) => void
) : Promise<boolean> {
	setError("")
	try {
		authClass.setAuthenticating(true)
		const cleanGoogleData: NewGoogleInfoRequest = {
			username: googleInfo.username
		}
		const response = await wiretapApiClient.authDataService.registerGoogleInfo(cleanGoogleData)
		if (!isEqual(response.status, 200) || isNonSuccessResponse(response.data)) {
			setError("Unable to register username. Please reload the page and try again")
			return false
		}
		if (typeof window === "undefined") return false

		personalInfoClass.setRegisteredValues(googleInfo.username, response.data.email)
		authClass.setAuthState({
			isAuthenticated: true,
			hasCompletedSignup: true
		})
		fundsClass.addFund(response.data.fund)
		return true
	} catch (error: unknown) {
		setErrorAxiosResponse(error, setError)
		return false
	} finally {
		authClass.setAuthenticating(false)
	}
}
