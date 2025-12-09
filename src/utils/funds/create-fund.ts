"use client"

import isEqual from "lodash-es/isEqual"
import authClass from "../../classes/auth-class"
import { isErrorResponse } from "../type-checks"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import fundsClass from "../../classes/funds-class"

export default async function createFund(): Promise<FundsUUID | undefined> {
	try {
		if (authClass.isFinishedWithSignup === false) return

		const fundInformation = fundsClass.createFundData
		const createFundResponse = await wiretapApiClient.fundsDataService.createFund(fundInformation)
		if (!isEqual(createFundResponse.status, 200) || isErrorResponse(createFundResponse.data)) {
			throw Error ("Unable to create new fund")
		}

		fundsClass.addFund({
			fundUUID: createFundResponse.data.fundUUID,
			fundName: fundInformation.fundName,
			startingAccountCashBalanceUsd: fundInformation.startingAccountCashBalanceUsd,
			currentAccountCashBalanceUsd: fundInformation.startingAccountCashBalanceUsd,
			isPrimaryFund: false,
			positionsValueUsd: 0,
			positions: [],
			transactions: {
				purchaseOrders: [],
				saleOrders: []
			}
		})
		return createFundResponse.data.fundUUID
	} catch (error) {
		console.error(error)
		return undefined
	}
}
