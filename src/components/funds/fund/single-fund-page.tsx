"use client"

import { observer } from "mobx-react"
import { useEffect, useMemo } from "react"
import isUndefined from "lodash-es/isUndefined"
import fundsClass from "../../../classes/funds-class"
import InternalContainerLayout from "../../layouts/internal-container-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import PriceHistoryChart from "../../price-history-chart"
import PositionsTab from "./positions-tab"
import TransactionHistoryTab from "./transaction-history-tab"

function SingleFundPage({ fundId }: { fundId: FundsUUID}): React.ReactNode {
	const fund = useMemo((): SingleFund | undefined => {
		return fundsClass.funds.get(fundId)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundId, fundsClass.funds.size])

	useEffect((): void => {
		document.title = `${fund?.fundName} | Wiretap`
	}, [fund?.fundName])

	if (isUndefined(fund)) return (
		<InternalContainerLayout>
			<div>Loading...</div>
		</InternalContainerLayout>
	)

	return (
		<InternalContainerLayout preventElasticScroll={true}>
			<div className="flex flex-col h-full w-full px-6 pt-6 pb-[48px] gap-6">
				{/* Fund Name */}
				<h1 className="text-3xl font-bold">{fund.fundName}</h1>

				{/* Portfolio Value Chart */}
				<div className="w-full h-64 rounded-lg overflow-hidden bg-sidebar-blue p-4">
					<div className="w-full h-full rounded-[5px] overflow-hidden">
						<PriceHistoryChart
							priceHistory={
								fund.portfolioHistory && fund.portfolioHistory.length > 0
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

				{/* Tabs Section */}
				<Tabs defaultValue="positions" className="flex-1 flex flex-col min-h-0">
					<TabsList>
						<TabsTrigger value="positions">Positions</TabsTrigger>
						<TabsTrigger value="history">History</TabsTrigger>
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
		</InternalContainerLayout>
	)
}

export default observer(SingleFundPage)
