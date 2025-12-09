"use client"

import { action, makeAutoObservable } from "mobx"

type TradeTab = "Buy" | "Sell"

class TradeClass {
	public tradeTab: TradeTab = "Buy"
	public selectedMarket: OutcomeString = "Yes" as OutcomeString
	public selectedClobToken: ClobTokenId | undefined = undefined
	public amount: string = ""
	public yesPrice: number = 0
	public noPrice: number = 0
	public marketId: MarketId | undefined = undefined
	public marketQuestion: string | null = null

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

	public setYesPrice = action((price: number): void => {
		this.yesPrice = price
	})

	public setNoPrice = action((price: number): void => {
		this.noPrice = price
	})

	public setPrices = action((yesPrice: number, noPrice: number): void => {
		this.yesPrice = yesPrice
		this.noPrice = noPrice
	})

	public setMarketId = action((marketId: MarketId | undefined): void => {
		this.marketId = marketId
	})

	public setMarketQuestion = action((marketQuestion: string | null): void => {
		this.marketQuestion = marketQuestion
	})

	public reset(): void {
		this.tradeTab = "Buy"
		this.selectedMarket = "Yes" as OutcomeString
		this.selectedClobToken = undefined
		this.amount = ""
		this.yesPrice = 0
		this.noPrice = 0
		this.marketId = undefined
		this.marketQuestion = null
	}

	public logout(): void {
		this.reset()
	}
}

const tradeClass = new TradeClass()

export default tradeClass
