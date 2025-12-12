"use client"

import { action, makeAutoObservable } from "mobx"

type TradeTab = "Buy" | "Sell"

class TradeClass {
	public tradeTab: TradeTab = "Buy"
	public selectedMarket: OutcomeString = "Yes" as OutcomeString
	public selectedClobToken: ClobTokenId | undefined = undefined
	public amount: string = ""
	public buyYesPrice: number = 0
	public buyNoPrice: number = 0
	public sellYesPrice: number = 0
	public sellNoPrice: number = 0
	public marketId: MarketId | undefined = undefined

	constructor() {
		makeAutoObservable(this)
	}

	public setTradeTab = action((tab: TradeTab): void => {
		this.tradeTab = tab
	})

	public setSelectedMarket = action((market: OutcomeString): void => {
		this.selectedMarket = market
	})

	public setSelectedClobToken = action((clobToken: ClobTokenId | undefined): void => {
		this.selectedClobToken = clobToken
	})

	public setAmount = action((amount: string): void => {
		this.amount = amount
	})

	public setPrices = action((
		buyYesPrice: number,
		buyNoPrice: number,
		sellYesPrice: number,
		sellNoPrice: number
	): void => {
		this.buyYesPrice = buyYesPrice
		this.buyNoPrice = buyNoPrice
		this.sellYesPrice = sellYesPrice
		this.sellNoPrice = sellNoPrice
	})

	public setMarketId = action((marketId: MarketId | undefined): void => {
		this.marketId = marketId
	})

	private reset(): void {
		this.tradeTab = "Buy"
		this.selectedMarket = "Yes" as OutcomeString
		this.selectedClobToken = undefined
		this.amount = ""
		this.buyYesPrice = 0
		this.buyNoPrice = 0
		this.sellYesPrice = 0
		this.sellNoPrice = 0
		this.marketId = undefined
	}

	public logout(): void {
		this.reset()
	}
}

const tradeClass = new TradeClass()

export default tradeClass
