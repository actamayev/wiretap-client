/* eslint-disable max-len */
"use client"

import Image from "next/image"
import { observer } from "mobx-react"
import isUndefined from "lodash-es/isUndefined"
import { useCallback, useState, useMemo } from "react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import tradeClass from "../../classes/trade-class"
import fundsClass from "../../classes/funds-class"
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


// eslint-disable-next-line max-lines-per-function, complexity
function TradeCard({ event }: { event: SingleEvent }): React.ReactNode {
	const [isLoading, setIsLoading] = useState(false)

	const updateClobToken = (outcomeIndex: 0 | 1): void => {
		if (isUndefined(tradeClass.marketId)) return

		// Find the event that contains this market
		const market = event.eventMarkets.find((m): boolean => m.marketId === tradeClass.marketId)
		if (market) {
			const clobToken = outcomeIndex === 0 ? market.outcomes[0].clobTokenId : market.outcomes[1].clobTokenId
			tradeClass.setSelectedClobToken(clobToken)
		}
	}

	// Calculate shares owned - MobX observer will track observable changes
	const sharesOwned = fundsClass.getSharesOwnedForClobToken(tradeClass.selectedClobToken)

	// Get selected fund for validation
	const selectedFund = fundsClass.selectedFundUuid
		? fundsClass.funds.get(fundsClass.selectedFundUuid)
		: undefined


	// Compute if button should be disabled based on validation
	const isDisabled = useMemo((): boolean => {
		if (!tradeClass.amount || parseFloat(tradeClass.amount) <= 0) {
			return false
		}

		const amountValue = parseFloat(tradeClass.amount)

		if (tradeClass.tradeTab === "Buy") {
			// Validate buy: check if user has sufficient funds
			return selectedFund ? amountValue > selectedFund.currentAccountCashBalanceUsd : false
		} else {
			// Validate sell: check if user has sufficient shares
			return amountValue > sharesOwned
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tradeClass.tradeTab, tradeClass.amount, selectedFund?.currentAccountCashBalanceUsd, sharesOwned])

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

	// Get the selected market (for multi-market events)
	const selectedMarket = useMemo((): SingleMarket | undefined => {
		if (event.eventMarkets.length === 1) return event.eventMarkets[0]
		// For multi-market events, find the market matching tradeClass.marketId or event.selectedMarketId
		if (tradeClass.marketId) {
			return event.eventMarkets.find((m): boolean => m.marketId === tradeClass.marketId)
		}
		return event.eventMarkets.find((m): boolean => m.marketId === event.selectedMarketId) ?? event.eventMarkets[0]
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event, tradeClass.marketId, event.selectedMarketId])

	const isMultiMarket = event.eventMarkets.length > 1

	return (
		<div className="bg-sidebar-blue rounded-lg p-4">
			{/* Market Info (for multi-market events) */}
			{isMultiMarket && selectedMarket && (
				<div className="flex items-center gap-3 mb-4">
					{selectedMarket.marketIconUrl ? (
						<div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-muted">
							<Image
								src={selectedMarket.marketIconUrl}
								alt={selectedMarket.groupItemTitle || selectedMarket.marketQuestion || "Market"}
								width={40}
								height={40}
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						<div className="w-10 h-10 shrink-0 rounded-md bg-muted" />
					)}
					<div className="flex-1 min-w-0">
						<div className="text-sm font-medium line-clamp-1">
							{selectedMarket.groupItemTitle || selectedMarket.marketQuestion || "Market"}
						</div>
					</div>
				</div>
			)}

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

			{/* First/Second Outcome Buttons */}
			<div className="flex gap-2 mb-4">
				<Button
					variant={tradeClass.selectedOutcomeIndex === 0 ? "default" : "outline"}
					className={cn(
						"flex-1 h-14",
						tradeClass.selectedOutcomeIndex === 0 ? "bg-yes-green hover:bg-yes-green-hover text-white" : ""
					)}
					onClick={(): void => {
						tradeClass.setSelectedOutcomeIndex(0)
						updateClobToken(0)
					}}
				>
					<div className="flex items-center justify-center gap-2 w-full">
						<span className="font-semibold text-xl opacity-90">
							{selectedMarket?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 0)?.outcome}
						</span>
						<span className="text-2xl font-bold">{formatPrice(selectedMarket?.firstOutcomePrice ?? 0)}</span>
					</div>
				</Button>
				<Button
					variant={tradeClass.selectedOutcomeIndex === 1 ? "default" : "outline"}
					className={cn(
						"flex-1 h-14",
						tradeClass.selectedOutcomeIndex === 1 ? "bg-no-red hover:bg-no-red-hover text-white" : ""
					)}
					onClick={(): void => {
						tradeClass.setSelectedOutcomeIndex(1)
						updateClobToken(1)
					}}
				>
					<div className="flex items-center justify-center gap-2 w-full">
						<span className="font-semibold text-xl opacity-90">
							{selectedMarket?.outcomes.find((outcome): boolean => outcome.outcomeIndex === 1)?.outcome}
						</span>
						<span className="text-2xl font-bold">{formatPrice(selectedMarket?.secondOutcomePrice ?? 0)}</span>
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
			<div className="flex flex-col gap-2">
				<Button
					variant="default"
					className="w-full bg-trade-button hover:bg-trade-button-hover text-white text-2xl h-12"
					onClick={handleTrade}
					disabled={isLoading || isDisabled}
				>
					<div className="flex items-center justify-center gap-2">
						{isLoading && <Spinner className="size-5" />}
						<span>
							{tradeClass.tradeTab} {" "}
							{selectedMarket?.outcomes.find((outcome): boolean => outcome.outcomeIndex === tradeClass.selectedOutcomeIndex)?.outcome}
						</span>
					</div>
				</Button>
			</div>
		</div>
	)
}

export default observer(TradeCard)
