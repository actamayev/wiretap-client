"use client"

import isEqual from "lodash-es/isEqual"
import { isErrorResponse } from "../type-checks"
import authClass from "../../classes/auth-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import fundsClass from "../../classes/funds-class"

export default async function retrieveAllFunds(): Promise<void> {
	try {
		if (
			authClass.isLoggedIn === false ||
			fundsClass.isRetrievingAllFunds === true ||
			fundsClass.hasRetrievedAllFunds === true
		) return

		fundsClass.setIsRetrievingAllFunds(true)

		const fundsResponse = await wiretapApiClient.fundsDataService.retrieveAllFunds()
		if (!isEqual(fundsResponse.status, 200) || isErrorResponse(fundsResponse.data)) {
			throw Error ("Unable to retrieve funds")
		}

		fundsClass.setFunds(fundsResponse.data.funds)
	} catch (error) {
		console.error(error)
		fundsClass.setIsRetrievingAllFunds(false)
	}
}
