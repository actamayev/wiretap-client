"use client"

import isEqual from "lodash-es/isEqual"
import { isNonSuccessResponse } from "../type-checks"
import authClass from "../../classes/auth-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import fundsClass from "../../classes/funds-class"

export default async function retrieveDetailedFund(wiretapFundUUID: FundsUUID): Promise<void> {
	try {
		if (
			authClass.isLoggedIn === false ||
			fundsClass.isDetailedFundRetrieved(wiretapFundUUID) ||
			fundsClass.isRetrievingDetailedFund(wiretapFundUUID)
		) return

		fundsClass.setIsRetrievingDetailedFund(wiretapFundUUID, true)

		const fundsResponse = await wiretapApiClient.fundsDataService.retrieveDetailedFund(wiretapFundUUID)
		if (!isEqual(fundsResponse.status, 200) || isNonSuccessResponse(fundsResponse.data)) {
			throw Error ("Unable to retrieve detailed fund")
		}

		fundsClass.addDetailedInformationToFund(wiretapFundUUID, fundsResponse.data.fund)
		fundsClass.setIsRetrievingDetailedFund(wiretapFundUUID, false)
	} catch (error) {
		console.error(error)
	} finally {
		fundsClass.setIsRetrievingDetailedFund(wiretapFundUUID, false)
	}
}
