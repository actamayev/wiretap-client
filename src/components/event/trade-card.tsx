"use client"

import { observer } from "mobx-react"
import { useCallback, useState } from "react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import tradeClass from "../../classes/trade-class"
import eventsClass from "../../classes/events-class"
import fundsClass from "../../classes/funds-class"
import isUndefined from "lodash-es/isUndefined"
import buyShares from "../../utils/trade/buy-shares"
import sellShares from "../../utils/trade/sell-shares"

const formatPrice = (price: number): string => {
	return `${(price * 100).toFixed(1)}¢`
}

const addCommas = (num: string | number): string => {
	const numStr = num.toString()
	return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const removeNonNumeric = (num: string): string => {
	return num.toString().replace(/[^0-9]/g, "")
}

const formatAmountValue = (value: string, isBuy: boolean): string => {
	if (!value) return ""
	const numericValue = removeNonNumeric(value)
	if (!numericValue) return ""
	const formattedValue = addCommas(numericValue)
	return isBuy ? `$${formattedValue}` : formattedValue
}

const parseAmountValue = (value: string): string => {
	// Remove $, commas, and other non-numeric characters
	return removeNonNumeric(value)
}

// eslint-disable-next-line max-lines-per-function
function TradeCard(): React.ReactNode {
	const [isLoading, setIsLoading] = useState(false)

	const updateClobToken = (outcome: OutcomeString): void => {
		if (isUndefined(tradeClass.marketId)) return

		// Find the event that contains this market
		for (const event of eventsClass.events.values()) {
			const market = event.eventMarkets.find((m): boolean => m.marketId === tradeClass.marketId)
			if (market) {
				const clobToken = outcome === "Yes" ? market.outcomes[0].clobTokenId : market.outcomes[1].clobTokenId
				tradeClass.setSelectedClobToken(clobToken)
				break
			}
		}
	}

	// Calculate shares owned - MobX observer will track observable changes
	const sharesOwned = fundsClass.getSharesOwnedForClobToken(tradeClass.selectedClobToken)

	// Get the correct price based on Buy/Sell tab and Yes/No selection
	const getYesPrice = (): number => {
		return tradeClass.tradeTab === "Buy" ? tradeClass.buyYesPrice : tradeClass.sellYesPrice
	}

	const getNoPrice = (): number => {
		return tradeClass.tradeTab === "Buy" ? tradeClass.buyNoPrice : tradeClass.sellNoPrice
	}

	const handleTrade = useCallback(async (): Promise<void> => {
		setIsLoading(true)
		try {
			if (tradeClass.tradeTab === "Buy") {
				await buyShares()
			} else {
				await sellShares()
			}
		} finally {
			setIsLoading(false)
		}
	}, [])

	return (
		<div className="bg-card rounded-lg p-4">
			{/* Tabs */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex gap-2">
					<Button
						variant={tradeClass.tradeTab === "Buy" ? "default" : "ghost"}
						size="sm"
						onClick={(): void => tradeClass.setTradeTab("Buy")}
						className="text-xl"
					>
						Buy
					</Button>
					<Button
						variant={tradeClass.tradeTab === "Sell" ? "default" : "ghost"}
						size="sm"
						onClick={(): void => tradeClass.setTradeTab("Sell")}
						className="text-xl"
					>
						Sell
					</Button>
				</div>
				<div className="text-xl text-muted-foreground">
					You own {addCommas(sharesOwned)} shares
				</div>
			</div>

			{/* Yes/No Buttons */}
			<div className="flex gap-2 mb-4">
				<Button
					variant={tradeClass.selectedMarket === "Yes" ? "default" : "outline"}
					className={cn(
						"flex-1 h-14",
						tradeClass.selectedMarket === "Yes" ? "bg-yes-green hover:bg-yes-green-hover text-white" : ""
					)}
					onClick={(): void => {
						tradeClass.setSelectedMarket("Yes" as OutcomeString)
						updateClobToken("Yes" as OutcomeString)
					}}
				>
					<div className="flex items-center justify-center gap-2 w-full">
						<span className="font-semibold text-xl opacity-90">Yes</span>
						<span className="text-2xl font-bold">{formatPrice(getYesPrice())}</span>
					</div>
				</Button>
				<Button
					variant={tradeClass.selectedMarket === "No" ? "default" : "outline"}
					className={cn(
						"flex-1 h-14",
						tradeClass.selectedMarket === "No" ? "bg-no-red hover:bg-no-red-hover text-white" : ""
					)}
					onClick={(): void => {
						tradeClass.setSelectedMarket("No" as OutcomeString)
						updateClobToken("No" as OutcomeString)
					}}
				>
					<div className="flex items-center justify-center gap-2 w-full">
						<span className="font-semibold text-xl opacity-90">No</span>
						<span className="text-2xl font-bold">{formatPrice(getNoPrice())}</span>
					</div>
				</Button>
			</div>

			{/* Amount Input */}
			<div className="mb-4">
				<div className="relative">
					<span className={cn(
						"absolute left-3 top-1/2 transform -translate-y-1/2 text-3xl",
						"text-muted-foreground pointer-events-none"
					)}>
						{tradeClass.tradeTab === "Buy" ? "Amount" : "Shares"}
					</span>
					<Input
						type="text"
						inputMode="numeric"
						placeholder={tradeClass.tradeTab === "Buy" ? "$0" : "0"}
						value={formatAmountValue(tradeClass.amount, tradeClass.tradeTab === "Buy")}
						onChange={(e): void => {
							const parsedValue = parseAmountValue(e.target.value)
							tradeClass.setAmount(parsedValue)
						}}
						className={cn(
							"w-full text-lg focus-visible:ring-0 focus-visible:ring-offset-0 text-right pl-20",
							"[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none",
							"[&::-webkit-inner-spin-button]:appearance-none h-14 text-3xl!"
						)}
					/>
				</div>
			</div>

			{/* Action Button */}
			<Button
				variant="default"
				className="w-full bg-trade-button hover:bg-trade-button-hover text-white text-2xl h-12"
				onClick={handleTrade}
				disabled={isLoading}
			>
				<div className="flex items-center justify-center gap-2">
					{isLoading && <Spinner className="size-5" />}
					<span>{tradeClass.tradeTab} {tradeClass.selectedMarket}</span>
				</div>
			</Button>
		</div>
	)
}

export default observer(TradeCard)
