"use client"

import isEqual from "lodash-es/isEqual"
import { isNonSuccessResponse } from "../type-checks"
import authClass from "../../classes/auth-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import fundsClass from "../../classes/funds-class"

// Map timeframe key to TimeWindow API value
function timeframeToTimeWindow(timeframe: keyof PortfolioPriceHistories): TimeWindow {
	switch (timeframe) {
		case "1h":
			return "1H"
		case "1d":
			return "1D"
		case "1w":
			return "1W"
		case "1m":
			return "1M"
		case "max":
			return "MAX"
		default:
			return "1D"
	}
}

export default async function retrievePortfolioPriceHistory(
	fundUUID: FundsUUID,
	timeframe: keyof PortfolioPriceHistories
): Promise<void> {
	try {
		if (
			authClass.isLoggedIn === false ||
			fundsClass.isRetrievingPortfolioHistory(fundUUID, timeframe)
		) return

		// Check if data already exists
		const fund = fundsClass.funds.get(fundUUID)
		if (fund?.portfolioHistory?.[timeframe] && fund.portfolioHistory[timeframe].length > 0) {
			fundsClass.setSelectedTimeframe(fundUUID, timeframe)
			return
		}

		fundsClass.setIsRetrievingPortfolioHistory(fundUUID, timeframe, true)

		const timeWindow = timeframeToTimeWindow(timeframe)
		const portfolioHistoryResponse = await wiretapApiClient.fundsDataService.retrievePortfolioHistoryByResolution(
			fundUUID,
			timeWindow
		)

		if (!isEqual(portfolioHistoryResponse.status, 200) || isNonSuccessResponse(portfolioHistoryResponse.data)) {
			throw Error("Unable to retrieve portfolio history")
		}

		fundsClass.setPortfolioHistory(fundUUID, timeframe, portfolioHistoryResponse.data.portfolioHistory)
		fundsClass.setSelectedTimeframe(fundUUID, timeframe)
		fundsClass.setIsRetrievingPortfolioHistory(fundUUID, timeframe, false)
	} catch (error) {
		console.error(`Error retrieving portfolio history for timeframe ${timeframe}:`, error)
		fundsClass.setIsRetrievingPortfolioHistory(fundUUID, timeframe, false)
	}
}
