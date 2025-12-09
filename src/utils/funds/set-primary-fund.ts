"use client"

import isEqual from "lodash-es/isEqual"
import isUndefined from "lodash-es/isUndefined"
import authClass from "../../classes/auth-class"
import { isNonSuccessResponse, isSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import fundsClass from "../../classes/funds-class"

export default async function setPrimaryFund(fundUUID: FundsUUID): Promise<void> {
	try {
		if (authClass.isFinishedWithSignup === false) return

		const fund = fundsClass.funds.get(fundUUID)
		if (isUndefined(fund)) return

		let needsPositions = false
		if (isUndefined(fund.positions)) {
			needsPositions = true
		}

		const setPrimaryFundResponse = await wiretapApiClient.fundsDataService.setPrimaryFund(fundUUID, needsPositions)
		if (!isEqual(setPrimaryFundResponse.status, 200) || isNonSuccessResponse(setPrimaryFundResponse.data)) {
			throw Error("Unable to set primary fund")
		}

		// Update the primary fund flags in the class
		fundsClass.updatePrimaryFund(fundUUID)

		// This means that we already had positions, so we don't need to retrieve them again
		if (isSuccessResponse(setPrimaryFundResponse.data)) return

		fundsClass.setFundPositions(fundUUID, setPrimaryFundResponse.data.positions)
	} catch (error) {
		console.error(error)
		return
	}
}
