"use client"

import isEqual from "lodash-es/isEqual"
import authClass from "../../../classes/auth-class"
import { isNonSuccessResponse } from "../../type-checks"
import confirmRegisterFields from "../confirm-register-fields"
import personalInfoClass from "../../../classes/personal-info-class"
import wiretapApiClient from "../../../classes/wiretap-api-client-class"
import setErrorAxiosResponse from "../../error-handling/set-error-axios-response"
import fundsClass from "../../../classes/funds-class"

export default async function registerSubmit(
	registerCredentials: IncomingRegisterRequest,
	setError: (error: string) => void,
): Promise<boolean> {
	try {
		setError("")
		const areCredentialsValid = confirmRegisterFields(registerCredentials, setError)
		if (areCredentialsValid === false) return false

		authClass.setAuthenticating(true)
		if (typeof window === "undefined") return false

		const response = await wiretapApiClient.authDataService.register(registerCredentials)

		if (!isEqual(response.status, 200) || isNonSuccessResponse(response.data)) {
			setError("Unable to register. Please reload the page and try again")
			return false
		}
		authClass.setAuthState({
			isAuthenticated: true,
			hasCompletedSignup: true
		})
		personalInfoClass.setRegisteredValues(
			registerCredentials.username,
			registerCredentials.email,
		)
		fundsClass.setFunds(response.data.funds)
		return true
	} catch (error: unknown) {
		setErrorAxiosResponse(error, setError)
		return false
	} finally {
		authClass.setAuthenticating(false)
	}
}
