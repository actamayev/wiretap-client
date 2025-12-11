"use client"

import Image from "next/image"
import { useState, useMemo } from "react"
import { ArrowDownWideNarrow } from "lucide-react"
import { Input } from "../../ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select"
import { cn } from "../../../lib/utils"
import { formatCurrency } from "../../../utils/format"
import useTypedNavigate from "../../../hooks/navigate/use-typed-navigate"

type HistorySortOption = "newest" | "oldest" | "value" | "number-of-shares"

interface TransactionHistoryTabProps {
	transactions: TransactionResponse
}

// eslint-disable-next-line max-lines-per-function
export default function TransactionHistoryTab({ transactions }: TransactionHistoryTabProps): React.ReactNode {
	const navigate = useTypedNavigate()
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [sortOption, setSortOption] = useState<HistorySortOption>("newest")

	// Combine purchase and sale orders into a single list with type indicator
	type TransactionWithType = (PurchaseOrder & { transactionType: "purchase" }) | (SaleOrder & { transactionType: "sale" })

	const allTransactions = useMemo((): TransactionWithType[] => {
		return [
			...transactions.purchaseOrders.map((order): TransactionWithType => ({
				...order,
				transactionType: "purchase" as const
			})),
			...transactions.saleOrders.map((order): TransactionWithType => ({
				...order,
				transactionType: "sale" as const
			}))
		]
	}, [transactions])

	const filteredAndSortedTransactions = useMemo((): TransactionWithType[] => {
		// Filter by search query
		let filtered = allTransactions.filter((transaction): boolean => {
			if (!searchQuery.trim()) return true
			const searchLower = searchQuery.toLowerCase()
			return (
				transaction.marketQuestion?.toLowerCase().includes(searchLower) ||
				transaction.outcome.toLowerCase().includes(searchLower)
			)
		})

		// Sort based on selected option
		filtered = [...filtered].sort((a, b): number => {
			switch (sortOption) {
				case "newest":
					return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()

				case "oldest":
					return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()

				case "value":
					const aCostProceeds = a.transactionType === "purchase" ? a.totalCost : a.totalProceeds
					const bCostProceeds = b.transactionType === "purchase" ? b.totalCost : b.totalProceeds
					return Math.abs(bCostProceeds) - Math.abs(aCostProceeds)

				case "number-of-shares":
					const aShares = a.transactionType === "purchase" ? a.numberOfSharesPurchased : a.numberOfSharesSold
					const bShares = b.transactionType === "purchase" ? b.numberOfSharesPurchased : b.numberOfSharesSold
					return bShares - aShares

				default:
					return 0
			}
		})

		return filtered
	}, [allTransactions, searchQuery, sortOption])

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2 items-center">
				<Input
					type="text"
					placeholder="Search history..."
					value={searchQuery}
					onChange={(e): void => setSearchQuery(e.target.value)}
					className={cn(
						"flex-1 h-10 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0",
						"focus-visible:border-input text-button-text placeholder:text-button-text"
					)}
				/>
				<Select
					value={sortOption}
					onValueChange={(value): void => setSortOption(value as HistorySortOption)}
				>
					<SelectTrigger
						className={cn(
							"h-10 rounded-xl flex items-center gap-2 shrink-0 focus-visible:ring-0",
							"focus-visible:ring-offset-0 cursor-pointer"
						)}
					>
						<ArrowDownWideNarrow className="h-4 w-4 shrink-0" />
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent className="bg-off-sidebar-blue cursor-pointer">
						<SelectItem value="newest" className="cursor-pointer">Newest</SelectItem>
						<SelectItem value="oldest" className="cursor-pointer">Oldest</SelectItem>
						<SelectItem value="value" className="cursor-pointer">Cost/Proceeds</SelectItem>
						<SelectItem value="number-of-shares" className="cursor-pointer">Shares</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-lg border border-swan overflow-hidden mb-6">
				<table className="w-full">
					<thead className="bg-off-sidebar-blue">
						<tr>
							<th className="text-left p-4 font-semibold">Activity</th>
							<th className="text-left p-4 font-semibold">Market</th>
							<th className="text-left p-4 font-semibold">Yes/No</th>
							<th className="text-left p-4 font-semibold">Shares</th>
							<th className="text-left p-4 font-semibold">Cost/Proceeds</th>
							<th className="text-left p-4 font-semibold">Transaction Date</th>
						</tr>
					</thead>
					<tbody>
						{filteredAndSortedTransactions.length === 0 ? (
							<tr>
								<td colSpan={6} className="p-4 text-center text-muted-foreground">
									No transactions found
								</td>
							</tr>
						) : (
							filteredAndSortedTransactions.map((transaction, index): React.ReactNode => {
								const shares = transaction.transactionType === "purchase"
									? transaction.numberOfSharesPurchased
									: transaction.numberOfSharesSold
								const marketName = transaction.marketQuestion || transaction.outcome
								const activity = transaction.transactionType === "purchase" ? "Buy" : "Sell"
								const outcome = transaction.outcome
								const value = transaction.transactionType === "purchase"
									? transaction.totalCost
									: transaction.totalProceeds
								const displayValue = transaction.transactionType === "purchase" ? -value : value
								const valueColor = transaction.transactionType === "purchase" ? "text-no-red" : "text-yes-green"
								const valuePrefix = transaction.transactionType === "purchase" ? "-" : "+"
								const date = new Date(transaction.transactionDate).toLocaleDateString()

								return (
									<tr key={index} className="border-t border-swan hover:bg-off-sidebar-blue-hover">
										<td className="p-4">{activity}</td>
										<td className="p-4">
											<div
												onClick={(): void => navigate(`/event/${transaction.polymarketSlug}`)}
												className="flex items-center gap-3 cursor-pointer group"
											>
												<Image
													src={transaction.polymarketImageUrl}
													alt={marketName}
													width={40}
													height={40}
													className="shrink-0 rounded-md"
												/>
												<span className="group-hover:underline">{marketName}</span>
											</div>
										</td>
										<td className="p-4">{outcome}</td>
										<td className="p-4">{shares}</td>
										<td className={cn("p-4", valueColor)}>
											{valuePrefix}${formatCurrency(Math.abs(displayValue))}
										</td>
										<td className="p-4">{date}</td>
									</tr>
								)
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
