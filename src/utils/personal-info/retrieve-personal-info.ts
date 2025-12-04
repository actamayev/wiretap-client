"use client"

import isEqual from "lodash-es/isEqual"
import { isErrorResponse } from "../type-checks"
import personalInfoClass from "../../classes/personal-info-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"

export default async function retrievePersonalInfo(): Promise<void> {
	try {
		if (
			// We need to retrieve the personal info wherever we are to confirm Google users have finished registering their usernames
			personalInfoClass.isRetrievingPersonalInfo === true ||
			personalInfoClass.retrievedPersonalInfo === true
		) return

		personalInfoClass.setIsRetrievingPersonalDetails(true)

		const personalInfoResponse = await wiretapApiClient.personalInfoDataService.retrievePersonalInfo()
		if (!isEqual(personalInfoResponse.status, 200) || isErrorResponse(personalInfoResponse.data)) {
			throw Error ("Unable to retrieve personal info")
		}
		personalInfoClass.setRetrievedPersonalData(personalInfoResponse.data)
	} catch (error) {
		console.error(error)
		personalInfoClass.setIsRetrievingPersonalDetails(false)
	}
}
