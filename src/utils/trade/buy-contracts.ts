"use client"

import isEqual from "lodash-es/isEqual"
import isUndefined from "lodash-es/isUndefined"
import { isNonSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import tradeClass from "../../classes/trade-class"
import fundsClass from "../../classes/funds-class"

export default async function buyContracts(): Promise<boolean> {
	try {
		// Validate required data
		if (isUndefined(tradeClass.marketId)) {
			throw Error("Market ID is not set")
		}

		if (!tradeClass.selectedClobToken) {
			throw Error("No CLOB token selected")
		}

		if (!tradeClass.amount || parseFloat(tradeClass.amount) <= 0) {
			throw Error("Invalid amount")
		}

		const selectedFundUuid = fundsClass.selectedFundUuid
		if (!selectedFundUuid) {
			throw Error("No fund selected")
		}

		const numberOfContracts = parseFloat(tradeClass.amount)

		const response = await wiretapApiClient.tradeDataService.buy(
			selectedFundUuid,
			tradeClass.selectedClobToken,
			numberOfContracts
		)

		if (!isEqual(response.status, 200) || isNonSuccessResponse(response.data)) {
			throw Error("Unable to buy contracts")
		}

		// Reset amount after successful purchase
		tradeClass.setAmount("")
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}
