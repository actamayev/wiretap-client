"use client"

import { useMemo } from "react"
import { observer } from "mobx-react"
import { cn } from "../../lib/utils"
import fundsClass from "../../classes/funds-class"

interface PortfolioStats {
	totalFunds: number
	totalBalance: number
	totalStartingBalance: number
	totalPnL: number
}

function PortfolioStats(): React.ReactNode {
	const funds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

	const portfolioStats = useMemo((): PortfolioStats => {
		const totalFunds = funds.length
		const totalBalance = funds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.currentAccountBalanceUsd, 0)
		const totalStartingBalance = funds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.startingAccountBalanceUsd, 0)
		const totalPnL = totalBalance - totalStartingBalance

		return {
			totalFunds,
			totalBalance,
			totalStartingBalance,
			totalPnL
		}
	}, [funds])

	// TODO: Calculate positions value from actual positions data
	// For now, using placeholder - positions would need to be fetched for each fund
	const positionsValue = 0
	const cashValue = portfolioStats.totalBalance - positionsValue

	const formatCurrency = (value: number): string => {
		return value.toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	}

	return (
		<div className="shrink-0 flex flex-col text-left">
			<div className="text-2xl font-semibold text-center">
				Portfolio: ${formatCurrency(portfolioStats.totalBalance)}
			</div>
			<div className="flex items-center gap-4 text-lg text-muted-foreground">
				<span>Positions: ${formatCurrency(positionsValue)}</span>
				<span className={cn(cashValue > 0 && "text-yes-green")}>
					Cash: ${formatCurrency(cashValue)}
				</span>
			</div>
		</div>
	)
}

export default observer(PortfolioStats)
