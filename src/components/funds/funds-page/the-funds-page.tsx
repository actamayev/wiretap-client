"use client"

import { observer } from "mobx-react"
import { useMemo, useState } from "react"
import { ArrowDownWideNarrow, Plus } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select"
import SingleFundRow from "./single-fund-row"
import fundsClass from "../../../classes/funds-class"
import InternalContainerLayout from "../../layouts/internal-container-layout"
import { cn } from "../../../lib/utils"

type SortOption = "alphabetical" | "current-value" | "starting-balance" | "profit-loss"

// eslint-disable-next-line max-lines-per-function
function TheFundsPage(): React.ReactNode {
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [sortOption, setSortOption] = useState<SortOption>("alphabetical")

	const allFunds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

	const filteredAndSortedFunds = useMemo((): SingleFund[] => {
		// Filter by search query
		let filtered = allFunds.filter((fund: SingleFund): boolean => {
			if (!searchQuery.trim()) return true
			return fund.fundName.toLowerCase().includes(searchQuery.toLowerCase())
		})

		// Sort based on selected option
		filtered = [...filtered].sort((a: SingleFund, b: SingleFund): number => {
			switch (sortOption) {
				case "alphabetical":
					return a.fundName.localeCompare(b.fundName)

				case "current-value": {
					const aValue = a.currentAccountCashBalanceUsd + a.positionsValueUsd
					const bValue = b.currentAccountCashBalanceUsd + b.positionsValueUsd
					return bValue - aValue // Descending (highest first)
				}

				case "starting-balance":
					return (
						b.startingAccountCashBalanceUsd - a.startingAccountCashBalanceUsd
					) // Descending (highest first)

				case "profit-loss": {
					const aCurrentValue =
						a.currentAccountCashBalanceUsd + a.positionsValueUsd
					const aProfitLoss =
						a.startingAccountCashBalanceUsd > 0
							? ((aCurrentValue - a.startingAccountCashBalanceUsd) /
									a.startingAccountCashBalanceUsd) *
								100
							: 0
					const bCurrentValue =
						b.currentAccountCashBalanceUsd + b.positionsValueUsd
					const bProfitLoss =
						b.startingAccountCashBalanceUsd > 0
							? ((bCurrentValue - b.startingAccountCashBalanceUsd) /
									b.startingAccountCashBalanceUsd) *
								100
							: 0
					return bProfitLoss - aProfitLoss // Descending (highest first)
				}

				default:
					return 0
			}
		})

		return filtered
	}, [allFunds, searchQuery, sortOption])

	return (
		<InternalContainerLayout preventElasticScroll={true}>
			<div className="flex flex-col h-full w-full p-6">
				<div className="mb-4 flex gap-2 items-center">
					<Input
						type="text"
						placeholder="Search funds..."
						value={searchQuery}
						onChange={(e): void => setSearchQuery(e.target.value)}
						className="flex-1 h-10 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
					/>
					<Button
						onClick={(): void => fundsClass.setIsCreateFundDialogOpen(true)}
						className="h-10 rounded-xl text-lg text-white bg-eel dark:bg-swan shrink-0 flex items-center gap-2"
					>
						<Plus className="h-4 w-4 shrink-0" />
						Create Fund
					</Button>
					<Select
						value={sortOption}
						onValueChange={(value): void => setSortOption(value as SortOption)}
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
						<SelectContent className="bg-off-sidebar-blue cursor-pointer" >
							<SelectItem value="alphabetical" className="cursor-pointer">Alphabetically</SelectItem>
							<SelectItem value="current-value" className="cursor-pointer">Current Value</SelectItem>
							<SelectItem value="starting-balance" className="cursor-pointer">Starting Balance</SelectItem>
							<SelectItem value="profit-loss" className="cursor-pointer">Profit/Loss %</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{filteredAndSortedFunds.map((fund): React.ReactNode => (
					<SingleFundRow key={fund.fundUUID} fund={fund} />
				))}
			</div>
		</InternalContainerLayout>
	)
}

export default observer(TheFundsPage)
