"use client"

import { observer } from "mobx-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import tradeClass from "../../classes/trade-class"

const formatPrice = (price: number): string => {
	return `${(price * 100).toFixed(1)}¢`
}

function TradeCard(): React.ReactNode {
	return (
		<div className="bg-card rounded-lg p-4">
			{/* Tabs */}
			<div className="flex gap-2 mb-4">
				<Button
					variant={tradeClass.tradeTab === "Buy" ? "default" : "ghost"}
					size="sm"
					onClick={(): void => tradeClass.setTradeTab("Buy")}
					className="flex-1"
				>
					Buy
				</Button>
				<Button
					variant={tradeClass.tradeTab === "Sell" ? "default" : "ghost"}
					size="sm"
					onClick={(): void => tradeClass.setTradeTab("Sell")}
					className="flex-1"
				>
					Sell
				</Button>
			</div>

			{/* Yes/No Buttons */}
			<div className="flex gap-2 mb-4">
				<Button
					variant={tradeClass.selectedMarket === "Yes" ? "default" : "outline"}
					className={cn(
						"flex-1 h-12",
						tradeClass.selectedMarket === "Yes" ? "bg-green-600 hover:bg-green-700 text-white" : ""
					)}
					onClick={(): void => tradeClass.setSelectedMarket("Yes" as OutcomeString)}
				>
					<div className="flex items-center justify-between w-full">
						<span className="font-semibold">Yes</span>
						<span className="text-xs opacity-90">{formatPrice(tradeClass.yesPrice)}</span>
					</div>
				</Button>
				<Button
					variant={tradeClass.selectedMarket === "No" ? "default" : "outline"}
					className={cn(
						"flex-1 h-12",
						tradeClass.selectedMarket === "No" ? "bg-gray-600 hover:bg-gray-700 text-white" : ""
					)}
					onClick={(): void => tradeClass.setSelectedMarket("No" as OutcomeString)}
				>
					<div className="flex items-center justify-between w-full">
						<span className="font-semibold">No</span>
						<span className="text-xs opacity-90">{formatPrice(tradeClass.noPrice)}</span>
					</div>
				</Button>
			</div>

			{/* Amount Input */}
			<div className="mb-4">
				<div className="text-xs text-muted-foreground mb-1">Amount</div>
				<Input
					type="number"
					placeholder="$0"
					value={tradeClass.amount}
					onChange={(e): void => tradeClass.setAmount(e.target.value)}
					className="mb-2 focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
			</div>

			{/* Action Button */}
			<Button
				variant="default"
				className="w-full bg-gray-600 hover:bg-gray-700 text-white"
			>
				Trade
			</Button>
		</div>
	)
}

export default observer(TradeCard)
