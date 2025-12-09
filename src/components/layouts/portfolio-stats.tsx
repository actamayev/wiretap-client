"use client"

import { observer } from "mobx-react"
import { cn } from "../../lib/utils"
import fundsClass from "../../classes/funds-class"

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

	const allFunds = Array.from(fundsClass.funds.values())

	let portfolioStats: PortfolioStats

	if (selectedFund) {
		// Show data for selected fund only
		portfolioStats = {
			totalPortfolioValue: selectedFund.positionsValueUsd + selectedFund.currentAccountCashBalanceUsd,
			positionsValue: selectedFund.positionsValueUsd,
			cashBalance: selectedFund.currentAccountCashBalanceUsd
		}
	} else {
		// Show data for all funds combined
		const totalPortfolioValue = allFunds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.positionsValueUsd + fund.currentAccountCashBalanceUsd, 0)
		const positionsValue = allFunds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.positionsValueUsd, 0)
		const cashBalance = allFunds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.currentAccountCashBalanceUsd, 0)
		portfolioStats = {
			totalPortfolioValue,
			positionsValue,
			cashBalance
		}
	}

	const formatCurrency = (value: number): string => {
		return value.toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
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
