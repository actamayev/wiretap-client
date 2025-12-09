"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
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

type PositionsSortOption = "alphabetical" | "current-value" | "number-of-shares" | "purchase-date"

interface PositionsTabProps {
	positions: SinglePosition[]
}

// eslint-disable-next-line max-lines-per-function
export default function PositionsTab({ positions }: PositionsTabProps): React.ReactNode {
	const navigate = useTypedNavigate()
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [sortOption, setSortOption] = useState<PositionsSortOption>("alphabetical")

	const filteredAndSortedPositions = useMemo((): SinglePosition[] => {
		// Filter by search query
		let filtered = positions.filter((position: SinglePosition): boolean => {
			if (!searchQuery.trim()) return true
			const searchLower = searchQuery.toLowerCase()
			return (
				position.marketQuestion?.toLowerCase().includes(searchLower) ||
				position.outcome.toLowerCase().includes(searchLower)
			)
		})

		// Sort based on selected option
		filtered = [...filtered].sort((a: SinglePosition, b: SinglePosition): number => {
			switch (sortOption) {
				case "alphabetical":
					const aName = a.marketQuestion || a.outcome
					const bName = b.marketQuestion || b.outcome
					return aName.localeCompare(bName)

				case "current-value":
					// Note: We don't have current value per position, so we'll sort by shares as proxy
					return b.numberOfContractsHeld - a.numberOfContractsHeld

				case "number-of-shares":
					return b.numberOfContractsHeld - a.numberOfContractsHeld

				case "purchase-date":
					return new Date(b.positionCreatedAt).getTime() - new Date(a.positionCreatedAt).getTime()

				default:
					return 0
			}
		})

		return filtered
	}, [positions, searchQuery, sortOption])

	const positionRows = filteredAndSortedPositions.map((position: SinglePosition): {
		marketName: string
		outcome: string
		averageCostBasis: number
		currentSharePrice: number
		costBasis: number
		currentValue: number
		purchaseDate: Date
		polymarketSlug: EventSlug
		polymarketImageUrl: string
	} => {
		return {
			marketName: position.marketQuestion || position.outcome,
			outcome: position.outcome,
			averageCostBasis: position.costBasisPerContractUsd,
			currentSharePrice: position.currentMarketPricePerContractUsd,
			costBasis: position.costBasisPerContractUsd * position.numberOfContractsHeld,
			currentValue: position.currentMarketPricePerContractUsd * position.numberOfContractsHeld,
			purchaseDate: position.positionCreatedAt,
			polymarketSlug: position.polymarketSlug,
			polymarketImageUrl: position.polymarketImageUrl,
		}
	})

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2 items-center">
				<Input
					type="text"
					placeholder="Search positions..."
					value={searchQuery}
					onChange={(e): void => setSearchQuery(e.target.value)}
					className="flex-1 h-10 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
				<Select
					value={sortOption}
					onValueChange={(value): void => setSortOption(value as PositionsSortOption)}
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
						<SelectItem value="alphabetical" className="cursor-pointer">Alphabetically</SelectItem>
						<SelectItem value="current-value" className="cursor-pointer">Current Value</SelectItem>
						<SelectItem value="number-of-shares" className="cursor-pointer">Number of Shares</SelectItem>
						<SelectItem value="purchase-date" className="cursor-pointer">Purchase Date</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-lg border border-swan overflow-hidden mb-6">
				<table className="w-full">
					<thead className="bg-off-sidebar-blue">
						<tr>
							<th className="text-left p-4 font-semibold">Market</th>
							<th className="text-left p-4 font-semibold">Yes/No</th>
							<th className="text-left p-4 font-semibold">Average Cost Basis</th>
							<th className="text-left p-4 font-semibold">Current Share Price</th>
							<th className="text-left p-4 font-semibold">Cost Basis</th>
							<th className="text-left p-4 font-semibold">Current Value</th>
							<th className="text-left p-4 font-semibold">Purchase Date</th>
						</tr>
					</thead>
					<tbody>
						{positionRows.length === 0 ? (
							<tr>
								<td colSpan={7} className="p-4 text-center text-muted-foreground">
									No positions found
								</td>
							</tr>
						) : (
							positionRows.map((row, index): React.ReactNode => (
								<tr key={index} className="border-t border-swan hover:bg-off-sidebar-blue-hover">
									<td className="p-4">
										<div
											onClick={(): void => navigate(`/events/${row.polymarketSlug}`)}
											className="flex items-center gap-3 cursor-pointer group"
										>
											<Image
												src={row.polymarketImageUrl}
												alt={row.marketName}
												width={40}
												height={40}
												className="shrink-0 rounded-md"
											/>
											<span className="group-hover:underline">{row.marketName}</span>
										</div>
									</td>
									<td className="p-4">{row.outcome}</td>
									<td className="p-4">${formatCurrency(row.averageCostBasis)}</td>
									<td className="p-4">${formatCurrency(row.currentSharePrice)}</td>
									<td className="p-4">${formatCurrency(row.costBasis)}</td>
									<td className="p-4">${formatCurrency(row.currentValue)}</td>
									<td className="p-4">{new Date(row.purchaseDate).toLocaleDateString()}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
