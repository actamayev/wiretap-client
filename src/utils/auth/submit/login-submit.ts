"use client"

import isEqual from "lodash-es/isEqual"
import authClass from "../../../classes/auth-class"
import { isNonSuccessResponse } from "../../type-checks"
import personalInfoClass from "../../../classes/personal-info-class"
import confirmLoginFields from "../confirm-login-fields"
import wiretapApiClient from "../../../classes/wiretap-api-client-class"
import setErrorAxiosResponse from "../../error-handling/set-error-axios-response"

export default async function loginSubmit(
	loginInformation: IncomingLoginRequest,
	setError: (error: string) => void
) : Promise<boolean> {
	try {
		setError("")
		const areCredentialsValid = confirmLoginFields(loginInformation, setError)
		if (areCredentialsValid === false) return false

		authClass.setAuthenticating(true)
		const response = await wiretapApiClient.authDataService.login(loginInformation)
		if (!isEqual(response.status, 200) || isNonSuccessResponse(response.data)) {
			setError("Unable to log in. Please reload the page and try again")
			return false
		}
		authClass.setAuthState({
			isAuthenticated: true,
			hasCompletedSignup: true
		})
		personalInfoClass.setRetrievedPersonalData(response.data.personalInfo)
		return true
	} catch (error: unknown) {
		setErrorAxiosResponse(error, setError)
		return false
	} finally {
		authClass.setAuthenticating(false)
	}
}
