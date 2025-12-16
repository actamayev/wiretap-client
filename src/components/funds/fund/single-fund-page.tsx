"use client"

import { observer } from "mobx-react"
import { useEffect, useMemo, useState, useCallback } from "react"
import isUndefined from "lodash-es/isUndefined"
import fundsClass from "../../../classes/funds-class"
import authClass from "../../../classes/auth-class"
import ContainerLayout from "../../layouts/container-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Button } from "../../ui/button"
import { Spinner } from "../../ui/spinner"
import { cn } from "../../../lib/utils"
import PriceHistoryChartPage from "../../price-history-chart-page"
import PositionsTab from "./positions-tab"
import TransactionHistoryTab from "./transaction-history-tab"
import retrieveDetailedFund from "../../../utils/funds/retrieve-detailed-fund"
import retrievePortfolioPriceHistory from "../../../utils/funds/retrieve-portfolio-price-history"
import { timeframeConfig } from "../../../utils/constants/timeframe-config"

// eslint-disable-next-line max-lines-per-function
function SingleFundPage({ fundId }: { fundId: FundsUUID}): React.ReactNode {
	const fund = useMemo((): SingleUnfilledFund | undefined => {
		return fundsClass.funds.get(fundId)
		// MobX observable - accessing .size ensures reactivity
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundId, fundsClass.funds.size])

	useEffect((): void => {
		// Only retrieve detailed fund if:
		// 1. User is logged in
		// 2. Fund exists in the map
		// 3. Detailed info hasn't been retrieved yet
		if (!authClass.isLoggedIn || !fund || fundsClass.isDetailedFundRetrieved(fundId)) {
			return
		}
		void retrieveDetailedFund(fundId)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundId, fund, authClass.isLoggedIn])

	// Get selected timeframe from fund, default to "1d"
	const selectedTimeframe = useMemo((): keyof PortfolioPriceHistories => {
		return fund?.selectedTimeframe ?? "1d"

	}, [fund?.selectedTimeframe])

	const [isLoadingTimeframe, setIsLoadingTimeframe] = useState(false)

	// Function to fetch portfolio history for a specific timeframe
	const fetchTimeframeData = useCallback(async (timeframe: keyof PortfolioPriceHistories): Promise<void> => {
		if (!fund) return

		// Check if already retrieving
		if (fundsClass.isRetrievingPortfolioHistory(fundId, timeframe)) {
			return
		}

		// Check if data already exists
		const existingData = fund.portfolioHistory?.[timeframe]
		if (existingData && existingData.length > 0) {
			fundsClass.setSelectedTimeframe(fundId, timeframe)
			return
		}

		setIsLoadingTimeframe(true)
		try {
			await retrievePortfolioPriceHistory(fundId, timeframe)
		} catch (error) {
			console.error(`Error retrieving portfolio history for timeframe ${timeframe}:`, error)
		} finally {
			setIsLoadingTimeframe(false)
		}
	}, [fund, fundId])

	// Handle timeframe button click
	const handleTimeframeClick = useCallback((timeframe: keyof PortfolioPriceHistories): void => {
		if (isLoadingTimeframe) return
		void fetchTimeframeData(timeframe)
	}, [fetchTimeframeData, isLoadingTimeframe])

	useEffect((): void => {
		document.title = `${fund?.fundName} | Wiretap`
	}, [fund?.fundName])

	if (isUndefined(fund)) return (
		<ContainerLayout>
			<div>Loading...</div>
		</ContainerLayout>
	)

	return (
		<ContainerLayout>
			<div className="flex flex-col h-full w-full px-6 pt-6 pb-[48px] gap-6">
				{/* Fund Name */}
				<h1 className="text-3xl font-bold">{fund.fundName}</h1>

				{/* Portfolio Value Chart */}
				<div className="flex flex-col gap-4">
					<div className="w-full h-64 rounded-lg overflow-hidden bg-sidebar-blue p-4 border-2 border-white/30">
						<div className="w-full h-full rounded-[5px] overflow-hidden">
							<PriceHistoryChartPage
								priceHistory={
									fund.portfolioHistory?.[selectedTimeframe] && fund.portfolioHistory[selectedTimeframe].length > 0
										? fund.portfolioHistory[selectedTimeframe].map((snapshot): SinglePriceSnapshot => ({
											timestamp: typeof snapshot.timestamp === "string"
												? new Date(snapshot.timestamp)
												: snapshot.timestamp,
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
													price: fund.startingAccountCashBalanceUsd,
												})
											}
											return points
										})()
								}
								multiplyBy100={false}
							/>
						</div>
					</div>
					{/* Timeframe Selector */}
					<div className="flex gap-2 justify-center">
						{(Object.keys(timeframeConfig) as Array<keyof PortfolioPriceHistories>).map(
							(timeframe): React.ReactNode => (
								<Button
									key={timeframe}
									variant={selectedTimeframe === timeframe ? "default" : "outline"}
									size="sm"
									onClick={(): void => handleTimeframeClick(timeframe)}
									disabled={isLoadingTimeframe}
									className={cn(
										"min-w-[60px]",
										selectedTimeframe === timeframe && "bg-primary text-primary-foreground"
									)}
								>
									{isLoadingTimeframe && selectedTimeframe === timeframe ? (
										<Spinner className="size-4" />
									) : (
										timeframeConfig[timeframe].label
									)}
								</Button>
							)
						)}
					</div>
				</div>

				{/* Tabs Section */}
				<Tabs defaultValue="positions" className="flex-1 flex flex-col min-h-0">
					<TabsList className="bg-sidebar-blue">
						<TabsTrigger value="positions" className="cursor-pointer bg-sidebar-blue">Positions</TabsTrigger>
						<TabsTrigger value="history" className="cursor-pointer bg-sidebar-blue">History</TabsTrigger>
					</TabsList>
					<TabsContent value="positions" className="flex-1 min-h-0">
						<PositionsTab positions={fund.positions} />
					</TabsContent>
					<TabsContent value="history" className="flex-1 min-h-0">
						{fund.transactions ? (
							<TransactionHistoryTab transactions={fund.transactions} />
						) : (
							<div className="p-4 text-center text-muted-foreground">Loading transactions...</div>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</ContainerLayout>
	)
}

export default observer(SingleFundPage)
