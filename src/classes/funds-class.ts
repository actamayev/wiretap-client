"use client"

import isUndefined from "lodash-es/isUndefined"
import { action, makeAutoObservable } from "mobx"

class FundsClass {
	public isRetrievingAllFunds = false
	public hasRetrievedAllFunds = false
	public funds: Map<FundsUUID, SingleFund> = new Map()
	public isCreateFundDialogOpen = false
	public selectedFundUuid: FundsUUID | "" = ""
	public createFundData: IncomingCreateFundRequest = {
		fundName: "",
		startingAccountCashBalanceUsd: 0
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
			startingAccountCashBalanceUsd: 0
		})
	})

	public setIsRetrievingAllFunds = action((newIsRetrievingAllFunds: boolean): void => {
		this.isRetrievingAllFunds = newIsRetrievingAllFunds
	})

	private setHasRetrievedAllFunds = action((newHasRetrievedAllFunds: boolean): void => {
		this.hasRetrievedAllFunds = newHasRetrievedAllFunds
	})

	public setFunds = action((funds: SingleFund[]): void => {
		funds.forEach((fund): void => this.addFund(fund))
		this.setHasRetrievedAllFunds(true)
		this.setIsRetrievingAllFunds(false)

		// Set the primary fund as selected
		const primaryFund = funds.find((fund: SingleFund): boolean => fund.isPrimaryFund)
		if (!primaryFund) return
		this.setSelectedFundUuid(primaryFund.fundUUID)
	})

	public addFund = action((fund: SingleFund): void => {
		this.funds.set(fund.fundUUID, fund)
	})

	public updateFundName = action((fundUUID: FundsUUID, newName: string): void => {
		const fund = this.funds.get(fundUUID)
		if (isUndefined(fund)) return

		fund.fundName = newName
	})

	public setFundPositions = action((fundUUID: FundsUUID, positions: SinglePosition[]): void => {
		const fund = this.funds.get(fundUUID)
		if (isUndefined(fund)) return

		fund.positions = positions
	})

	public updateFundCashBalance = action((fundUUID: FundsUUID, newCashBalance: number): void => {
		const fund = this.funds.get(fundUUID)
		if (isUndefined(fund)) return

		fund.currentAccountCashBalanceUsd = newCashBalance
	})

	public incrementPositionsValue = action((fundUUID: FundsUUID, increment: number): void => {
		const fund = this.funds.get(fundUUID)
		if (isUndefined(fund)) return

		fund.positionsValueUsd += increment
	})

	public decrementPositionsValue = action((fundUUID: FundsUUID, decrement: number): void => {
		const fund = this.funds.get(fundUUID)
		if (isUndefined(fund)) return

		fund.positionsValueUsd -= decrement
	})

	public addContractsToPosition = action((
		fundUUID: FundsUUID,
		buyResponse: SuccessBuyOrderResponse
	): void => {
		const fund = this.funds.get(fundUUID)
		if (isUndefined(fund)) return

		// Always add a new position
		fund.positions.push(buyResponse.position)
	})

	public getSharesOwnedForClobToken = (clobToken: ClobTokenId | undefined): number => {
		if (!clobToken || !this.selectedFundUuid) {
			return 0
		}

		const fund = this.funds.get(this.selectedFundUuid)
		if (isUndefined(fund)) return 0

		// Sum up all positions that match the clobToken
		return fund.positions
			.filter((position): boolean => position.clobToken === clobToken)
			.reduce((total: number, position: SinglePosition): number => total + position.numberOfContractsHeld, 0)
	}

	public setPositionsForClobToken = action((
		fundUUID: FundsUUID,
		clobToken: ClobTokenId,
		newPositions: SinglePosition[]
	): void => {
		const fund = this.funds.get(fundUUID)
		if (isUndefined(fund)) return

		// Remove all existing positions with this clobToken
		fund.positions = fund.positions.filter(
			(position): boolean => position.clobToken !== clobToken
		)

		// Add the new positions from the backend
		fund.positions.push(...newPositions)
	})

	public updatePrimaryFund = action((newPrimaryFundUUID: FundsUUID): void => {
		// Set all funds to not primary
		this.funds.forEach((fund: SingleFund): void => {
			fund.isPrimaryFund = false
		})

		// Set the new primary fund
		const newPrimaryFund = this.funds.get(newPrimaryFundUUID)
		if (!isUndefined(newPrimaryFund)) {
			newPrimaryFund.isPrimaryFund = true
		}
	})

	public setSelectedFundUuid = action((fundUuid: FundsUUID | ""): void => {
		this.selectedFundUuid = fundUuid
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
		this.setIsCreateFundDialogOpen(false)
		this.setSelectedFundUuid("")
		this.setCreateFundData({
			fundName: "",
			startingAccountCashBalanceUsd: 0
		})
	}
}

const fundsClass = new FundsClass()

export default fundsClass
