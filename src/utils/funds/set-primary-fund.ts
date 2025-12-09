"use client"

import isEqual from "lodash-es/isEqual"
import isUndefined from "lodash-es/isUndefined"
import authClass from "../../classes/auth-class"
import fundsClass from "../../classes/funds-class"
import { isNonSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"

export default async function setPrimaryFund(fundUUID: FundsUUID): Promise<void> {
	try {
		if (authClass.isFinishedWithSignup === false) return

		const fund = fundsClass.funds.get(fundUUID)
		if (isUndefined(fund)) return

		const setPrimaryFundResponse = await wiretapApiClient.fundsDataService.setPrimaryFund(fundUUID)
		if (!isEqual(setPrimaryFundResponse.status, 200) || isNonSuccessResponse(setPrimaryFundResponse.data)) {
			throw Error("Unable to set primary fund")
		}

		// Update the primary fund flags in the class
		fundsClass.updatePrimaryFund(fundUUID)
	} catch (error) {
		console.error(error)
		return
	}
}
