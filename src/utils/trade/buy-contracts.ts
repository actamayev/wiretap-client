"use client"

import isEqual from "lodash-es/isEqual"
import isUndefined from "lodash-es/isUndefined"
import { isNonSuccessResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import tradeClass from "../../classes/trade-class"
import fundsClass from "../../classes/funds-class"

function validateBuyInputs(): FundsUUID {
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

	return selectedFundUuid
}

export default async function buyContracts(): Promise<boolean> {
	try {
		const selectedFundUuid = validateBuyInputs()
		const valueOfContractsPurchasing = parseFloat(tradeClass.amount)

		const response = await wiretapApiClient.tradeDataService.buy(
			selectedFundUuid,
			tradeClass.selectedClobToken as ClobTokenId,
			valueOfContractsPurchasing
		)

		if (!isEqual(response.status, 200) || isNonSuccessResponse(response.data)) {
			throw Error("Unable to buy contracts")
		}

		const buyResponse = response.data as SuccessBuyOrderResponse
		fundsClass.updateFundCashBalance(selectedFundUuid, buyResponse.newAccountCashBalance)

		// Add contracts to the position
		fundsClass.addContractsToPosition(selectedFundUuid, buyResponse)

		fundsClass.incrementPositionsValue(
			selectedFundUuid,
			buyResponse.position.numberOfContractsHeld * buyResponse.position.costBasisPerContractUsd
		)
		fundsClass.addBuyTransaction(selectedFundUuid, buyResponse)
		tradeClass.setAmount("")
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}
