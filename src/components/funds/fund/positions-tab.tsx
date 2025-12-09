"use client"

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

type PositionsSortOption = "alphabetical" | "current-value" | "number-of-shares"

interface PositionsTabProps {
	positions: SinglePosition[]
}

// eslint-disable-next-line max-lines-per-function
export default function PositionsTab({ positions }: PositionsTabProps): React.ReactNode {
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

				default:
					return 0
			}
		})

		return filtered
	}, [positions, searchQuery, sortOption])

	// Group positions by market/clobToken to calculate average cost basis
	// For now, we'll show placeholder data since we don't have cost basis info
	const positionRows = filteredAndSortedPositions.map((position: SinglePosition): {
		marketName: string
		averageCostBasis: number
		currentValue: number
	} => {
		return {
			marketName: position.marketQuestion || position.outcome,
			averageCostBasis: 0, // TODO: Calculate from transaction history
			currentValue: 0 // TODO: Calculate current market value
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
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-lg border border-swan overflow-hidden mb-6">
				<table className="w-full">
					<thead className="bg-off-sidebar-blue">
						<tr>
							<th className="text-left p-4 font-semibold">Market Name</th>
							<th className="text-left p-4 font-semibold">Average Cost Basis</th>
							<th className="text-left p-4 font-semibold">Current Value</th>
						</tr>
					</thead>
					<tbody>
						{positionRows.length === 0 ? (
							<tr>
								<td colSpan={3} className="p-4 text-center text-muted-foreground">
									No positions found
								</td>
							</tr>
						) : (
							positionRows.map((row, index): React.ReactNode => (
								<tr key={index} className="border-t border-swan hover:bg-off-sidebar-blue-hover">
									<td className="p-4">{row.marketName}</td>
									<td className="p-4">${formatCurrency(row.averageCostBasis)}</td>
									<td className="p-4">${formatCurrency(row.currentValue)}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
