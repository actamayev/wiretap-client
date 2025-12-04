"use client"

import isUndefined from "lodash-es/isUndefined"
import { action, makeAutoObservable } from "mobx"

class FundsClass {
	public isRetrievingAllFunds = false
	public hasRetrievedAllFunds = false
	public retrievingSingleFunds: Map<FundsUUID, boolean> = new Map()
	public funds: Map<FundsUUID, SingleFund> = new Map()
	public isCreateFundDialogOpen = false
	public createFundData: IncomingCreateFundRequest = {
		fundName: "",
		startingAccountBalanceUsd: 0
	}

	constructor() {
		makeAutoObservable(this)
	}

	public setIsCreateFundDialogOpen = action((newIsCreateFundDialogOpen: boolean): void => {
		this.isCreateFundDialogOpen = newIsCreateFundDialogOpen
		if (newIsCreateFundDialogOpen) return
		// Reset createFundData when closing the dialog
		this.setCreateFundData({
			fundName: "",
			startingAccountBalanceUsd: 0
		})
	})

	public setIsRetrievingAllFunds = action((newIsRetrievingAllFunds: boolean): void => {
		this.isRetrievingAllFunds = newIsRetrievingAllFunds
	})

	private setHasRetrievedAllFunds = action((newHasRetrievedAllFunds: boolean): void => {
		this.hasRetrievedAllFunds = newHasRetrievedAllFunds
	})

	public setFunds = action((funds: SingleFund[]): void => {
		funds.forEach((fund): void => this.addFund(fund.fundUUID, fund))
		this.setHasRetrievedAllFunds(true)
		this.setIsRetrievingAllFunds(false)
	})

	public addFund = action((fundUUID: FundsUUID, fund: SingleFund): void => {
		this.funds.set(fundUUID, fund)
	})

	public setIsRetrievingSingleFund = action((fundUUID: FundsUUID, isRetrieving: boolean): void => {
		this.retrievingSingleFunds.set(fundUUID, isRetrieving)
	})

	public isRetrievingSingleFund = (fundUUID: FundsUUID): boolean => {
		return this.retrievingSingleFunds.get(fundUUID) || false
	}

	public updateFundName = action((fundUUID: FundsUUID, newName: string): void => {
		const fund = this.funds.get(fundUUID)
		if (isUndefined(fund)) return

		fund.fundName = newName
	})

	public setCreateFundKey = action(<K extends keyof IncomingCreateFundRequest>(key: K, value: IncomingCreateFundRequest[K]): void => {
		this.createFundData[key] = value
	})

	private setCreateFundData = action((createFundData: IncomingCreateFundRequest): void => {
		this.createFundData = createFundData
	})

	// Update logout method to clear stream IDs:
	public logout(): void {
		this.setIsRetrievingAllFunds(false)
		this.setHasRetrievedAllFunds(false)
		this.funds = new Map()
		this.retrievingSingleFunds = new Map()
		this.setIsCreateFundDialogOpen(false)
		this.setCreateFundData({
			fundName: "",
			startingAccountBalanceUsd: 0
		})
	}
}

const fundsClass = new FundsClass()

export default fundsClass
