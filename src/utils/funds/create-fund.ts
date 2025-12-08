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
			startingAccountBalanceUsd: fundInformation.startingAccountBalanceUsd,
			currentAccountBalanceUsd: fundInformation.startingAccountBalanceUsd,
			isPrimaryFund: false
		})
		return createFundResponse.data.fundUUID
	} catch (error) {
		console.error(error)
		return undefined
	}
}
