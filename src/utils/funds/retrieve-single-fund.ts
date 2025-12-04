"use client"

import isNull from "lodash-es/isNull"
import isEqual from "lodash-es/isEqual"
import { isErrorResponse } from "../type-checks"
import authClass from "../../classes/auth-class"
import fundsClass from "../../classes/funds-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"

export default async function retrieveSingleFund(fundUUID: FundsUUID): Promise<void> {
	try {
		// If we already have the project in the context, no need to fetch it again
		const foundFund = fundsClass.funds.get(fundUUID)
		if (
			foundFund ||
			authClass.isFinishedWithSignup === false ||
			fundsClass.isRetrievingSingleFund(fundUUID)
		) return

		// Set loading state
		fundsClass.setIsRetrievingSingleFund(fundUUID, true)

		const fundResponse = await wiretapApiClient.fundsDataService.retrieveSingleFund(fundUUID)
		if (
			!isEqual(fundResponse.status, 200) ||
			isErrorResponse(fundResponse.data) ||
			isNull(fundResponse.data.singleFund)
		) {
			throw Error ("Unable to retrieve fund")
		}

		fundsClass.addFund(fundResponse.data.singleFund.fundUUID, fundResponse.data.singleFund)
	} catch (error) {
		console.error(error)
		fundsClass.setIsRetrievingSingleFund(fundUUID, false)
	}
}
