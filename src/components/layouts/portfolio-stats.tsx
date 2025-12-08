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
	const selectedFund = useMemo((): SingleFund | undefined => {
		if (!fundsClass.selectedFundUuid) {
			return undefined // We'll handle this case below
		}
		return fundsClass.funds.get(fundsClass.selectedFundUuid)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.selectedFundUuid, fundsClass.funds.size])

	const allFunds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

	const portfolioStats = useMemo((): PortfolioStats => {
		if (selectedFund) {
			// Show data for selected fund only
			return {
				totalFunds: 1,
				totalBalance: selectedFund.currentAccountBalanceUsd,
				totalStartingBalance: selectedFund.startingAccountBalanceUsd,
				totalPnL: selectedFund.currentAccountBalanceUsd - selectedFund.startingAccountBalanceUsd
			}
		}

		// Show data for all funds combined
		const totalBalance = allFunds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.currentAccountBalanceUsd, 0)
		const totalStartingBalance = allFunds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.startingAccountBalanceUsd, 0)

		return {
			totalFunds: allFunds.length,
			totalBalance,
			totalStartingBalance,
			totalPnL: totalBalance - totalStartingBalance
		}
	}, [selectedFund, allFunds])

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
			<div className="text-3xl font-semibold text-start">
				Portfolio:{" "}
				<span className={cn(portfolioStats.totalBalance > 0 && "text-yes-green")}>
					${formatCurrency(portfolioStats.totalBalance)}
				</span>
			</div>
			<div className="flex items-center gap-4 text-base text-muted-foreground">
				<span>
					Positions: {" "}
					<span className={cn(positionsValue > 0 && "text-yes-green")}>
						${formatCurrency(positionsValue)}
					</span>
				</span>
				<span>
					Cash: {" "}
					<span className={cn(cashValue > 0 && "text-yes-green")}>
						${formatCurrency(cashValue)}
					</span>
				</span>
			</div>
		</div>
	)
}

export default observer(PortfolioStats)
