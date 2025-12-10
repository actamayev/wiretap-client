"use client"

import isEqual from "lodash-es/isEqual"
import isUndefined from "lodash-es/isUndefined"
import { isNonSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import tradeClass from "../../classes/trade-class"
import fundsClass from "../../classes/funds-class"

function validateSellInputs(): { selectedFundUuid: FundsUUID; numberOfContracts: number } {
	if (isUndefined(tradeClass.marketId)) {
		throw Error("Market ID is not set")
	}

	if (!tradeClass.amount || parseFloat(tradeClass.amount) <= 0) {
		throw Error("Invalid amount")
	}

	const selectedFundUuid = fundsClass.selectedFundUuid
	if (!selectedFundUuid) {
		throw Error("No fund selected")
	}

	if (!tradeClass.selectedClobToken) {
		throw Error("No CLOB token selected")
	}

	const numberOfContracts = parseFloat(tradeClass.amount)
	return { selectedFundUuid, numberOfContracts }
}

export default async function sellShares(): Promise<boolean> {
	try {
		const { selectedFundUuid, numberOfContracts } = validateSellInputs()

		const response = await wiretapApiClient.tradeDataService.sell(
			selectedFundUuid,
			tradeClass.selectedClobToken as ClobTokenId,
			numberOfContracts
		)

		if (!isEqual(response.status, 200) || isNonSuccessResponse(response.data)) {
			throw Error("Unable to sell contracts")
		}

		const sellResponse = response.data as SuccessSellOrderResponse

		// Update fund balance with the new cash balance from the server
		fundsClass.updateFundCashBalance(selectedFundUuid, sellResponse.newAccountCashBalance)

		// Set positions for this clob token to the remaining positions from the backend
		fundsClass.setPositionsForClobToken(
			selectedFundUuid,
			tradeClass.selectedClobToken as ClobTokenId,
			sellResponse.remainingPositions
		)

		fundsClass.decrementPositionsValue(selectedFundUuid, sellResponse.totalProceeds)

		fundsClass.addSellTransaction(selectedFundUuid, sellResponse)
		// Reset amount after successful sale
		tradeClass.setAmount("")
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}
