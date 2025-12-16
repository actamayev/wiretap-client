"use client"

import { action, makeAutoObservable } from "mobx"

type TradeTab = "Buy" | "Sell"

class TradeClass {
	public tradeTab: TradeTab = "Buy"
	public selectedMarketIndex: number = 0
	public selectedClobToken: ClobTokenId | undefined = undefined
	public amount: string = ""
	public marketId: MarketId | undefined = undefined

	constructor() {
		makeAutoObservable(this)
	}

	public setTradeTab = action((tab: TradeTab): void => {
		this.tradeTab = tab
	})

	public setSelectedMarketIndex = action((marketIndex: number): void => {
		this.selectedMarketIndex = marketIndex
	})

	public setSelectedClobToken = action((clobToken: ClobTokenId | undefined): void => {
		this.selectedClobToken = clobToken
	})

	public setAmount = action((amount: string): void => {
		this.amount = amount
	})

	public setMarketId = action((marketId: MarketId | undefined): void => {
		this.marketId = marketId
	})

	public logout(): void {
		this.tradeTab = "Buy"
		this.selectedMarketIndex = 0
		this.selectedClobToken = undefined
		this.amount = ""
		this.marketId = undefined
	}
}

const tradeClass = new TradeClass()

export default tradeClass
