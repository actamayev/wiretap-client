"use client"

import { observer } from "mobx-react"
import { cn } from "../../../lib/utils"
import PriceHistoryChartCard from "../../price-history-chart-card"
import useTypedNavigate from "../../../hooks/navigate/use-typed-navigate"
import { formatCurrency } from "../../../utils/format"

function SingleFundRow({ fund }: { fund: SingleFund }): React.ReactNode {
	const navigate = useTypedNavigate()

	const totalPortfolioValue = fund.positionsValueUsd + fund.currentAccountCashBalanceUsd

	return (
		<div
			key={fund.fundUUID}
			onClick={(): void => navigate(`/funds/${fund.fundUUID}`)}
			className="rounded-lg p-4 hover:shadow-md transition-shadow bg-sidebar-blue cursor-pointer"
		>
			<div className="flex gap-8 w-full">
				{/* Column 1: Fund Info */}
				<div className="flex-1 flex flex-col gap-2">
					<h1 className="text-2xl font-bold">{fund.fundName}</h1>
					<p className="text-sm text-muted-foreground">
						Starting balance: ${formatCurrency(fund.startingAccountCashBalanceUsd)}
					</p>
					<p className="text-sm text-muted-foreground">
						Start date: {(new Date(fund.fundCreatedAt)).toLocaleDateString()}
					</p>
				</div>

				{/* Column 2: Empty */}
				<div className="flex-1" />

				{/* Column 3: Portfolio Stats */}
				<div className="flex-1 flex flex-col text-left">
					<div className="text-2xl font-semibold text-start">
						Portfolio:{" "}
						<span className={cn(totalPortfolioValue > 0 && "text-yes-green")}>
							${formatCurrency(totalPortfolioValue)}
						</span>
					</div>
					<div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
						<span>
							Positions: {" "}
							<span className={cn(fund.positionsValueUsd > 0 && "text-yes-green")}>
								${formatCurrency(fund.positionsValueUsd)}
							</span>
						</span>
						<span>
							Cash: {" "}
							<span className={cn(fund.currentAccountCashBalanceUsd > 0 && "text-yes-green")}>
								${formatCurrency(fund.currentAccountCashBalanceUsd)}
							</span>
						</span>
					</div>
				</div>

				{/* Column 4: Performance Chart */}
				<div className="flex-1 flex flex-col">
					<div className="h-24 w-full rounded-[5px] overflow-hidden">
						<PriceHistoryChartCard
							priceHistory={
								fund.portfolioHistory?.length > 0
									? fund.portfolioHistory.map((snapshot): SinglePriceSnapshot => ({
										timestamp: snapshot.timestamp,
										price: snapshot.portfolioValueUsd,
									}))
									: ((): SinglePriceSnapshot[] => {
										// Generate zero values for the last hour
										const now = new Date()
										const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
										const points: SinglePriceSnapshot[] = []
										// Create 10 data points over the last hour
										for (let i = 0; i < 10; i++) {
											const timestamp = new Date(
												oneHourAgo.getTime() + (i / 9) * (now.getTime() - oneHourAgo.getTime())
											)
											points.push({
												timestamp,
												price: 0,
											})
										}
										return points
									})()
							}
							multiplyBy100={false}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default observer(SingleFundRow)
