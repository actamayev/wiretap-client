"use client"

import { observer } from "mobx-react"
import { cn } from "../../lib/utils"
import fundsClass from "../../classes/funds-class"
import { formatCurrency } from "../../utils/format"

interface PortfolioStats {
	totalPortfolioValue: number
	positionsValue: number
	cashBalance: number
}

function PortfolioStats(): React.ReactNode {
	// MobX observer will track observable changes
	const selectedFund = fundsClass.selectedFundUuid
		? fundsClass.funds.get(fundsClass.selectedFundUuid)
		: undefined

	let portfolioStats: PortfolioStats = {
		totalPortfolioValue: 0,
		positionsValue: 0,
		cashBalance: 0
	}

	if (selectedFund) {
		// Show data for selected fund only
		portfolioStats = {
			totalPortfolioValue: selectedFund.positionsValueUsd + selectedFund.currentAccountCashBalanceUsd,
			positionsValue: selectedFund.positionsValueUsd,
			cashBalance: selectedFund.currentAccountCashBalanceUsd
		}
	}

	return (
		<div className="shrink-0 flex flex-col text-left">
			<div className="text-3xl font-semibold text-start">
				Portfolio:{" "}
				<span className={cn(portfolioStats.totalPortfolioValue > 0 && "text-yes-green")}>
					${formatCurrency(portfolioStats.totalPortfolioValue)}
				</span>
			</div>
			<div className="flex items-center gap-4 text-base text-muted-foreground">
				<span>
					Positions: {" "}
					<span className={cn(portfolioStats.positionsValue > 0 && "text-yes-green")}>
						${formatCurrency(portfolioStats.positionsValue)}
					</span>
				</span>
				<span>
					Cash: {" "}
					<span className={cn(portfolioStats.cashBalance > 0 && "text-yes-green")}>
						${formatCurrency(portfolioStats.cashBalance)}
					</span>
				</span>
			</div>
		</div>
	)
}

export default observer(PortfolioStats)
