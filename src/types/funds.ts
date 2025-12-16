declare global {
	interface SingleUnfilledFund extends SingleFund {
		transactions?: TransactionResponse
		portfolioHistory?: PortfolioPriceHistories
		selectedTimeframe?: keyof PortfolioPriceHistories
		retrievingPortfolioHistories?: Array<keyof PortfolioPriceHistories>
	}

	interface PortfolioPriceHistories {
		"1h": SinglePortfolioSnapshot[]
		"1d": SinglePortfolioSnapshot[]
		"1w": SinglePortfolioSnapshot[]
		"1m": SinglePortfolioSnapshot[]
		max: SinglePortfolioSnapshot[]
	}
}

export {}
