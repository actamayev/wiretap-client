"use client"

import { useCallback } from "react"
import isEqual from "lodash-es/isEqual"
import isUndefined from "lodash-es/isUndefined"
import { CredentialResponse } from "@react-oauth/google"
import authClass from "../../classes/auth-class"
import { isErrorResponses } from "../../utils/type-checks"
import personalInfoClass from "../../classes/personal-info-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import fundsClass from "../../classes/funds-class"

export default function useGoogleAuthCallback(): (successResponse: CredentialResponse) => Promise<GoogleAuthSuccess | null> {
	return useCallback(async (successResponse: CredentialResponse): Promise<GoogleAuthSuccess | null> => {
		try {
			authClass.setAuthenticating(true)
			if (
				isUndefined(successResponse.credential) ||
				isUndefined(successResponse.clientId) ||
				typeof window === "undefined"
			) return null

			const googleCallbackResponse = await wiretapApiClient.authDataService.googleLoginCallback(
				successResponse.credential
			)

			if (!isEqual(googleCallbackResponse.status, 200) || isErrorResponses(googleCallbackResponse.data)) {
				throw Error("Unable to log in")
			}

			authClass.setIsAuthenticated(true)

			if (googleCallbackResponse.data.isNewUser === true || isUndefined(googleCallbackResponse.data.personalInfo)) {
				return googleCallbackResponse.data
			}

			personalInfoClass.setRetrievedPersonalData(googleCallbackResponse.data.personalInfo)
			fundsClass.setFunds(googleCallbackResponse.data.funds)
			return googleCallbackResponse.data
		} catch (error) {
			console.error(error)
			return null
		} finally {
			authClass.setAuthenticating(false)
		}
	}, [])
}
