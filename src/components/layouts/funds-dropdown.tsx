"use client"

import { useMemo, useEffect } from "react"
import { observer } from "mobx-react"
import { Plus } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"
import fundsClass from "../../classes/funds-class"
import setPrimaryFund from "../../utils/funds/set-primary-fund"
import useTypedNavigate from "../../hooks/navigate/use-typed-navigate"
import { formatCurrency } from "../../utils/format"

// eslint-disable-next-line max-lines-per-function
function FundsDropdown(): React.ReactNode {
	const navigate = useTypedNavigate()
	const funds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

	// Fallback: Set first fund as selected if no fund is selected (shouldn't happen if primary fund is set correctly)
	useEffect((): void => {
		if (funds.length > 0 && !fundsClass.selectedFundUuid) {
			fundsClass.setSelectedFundUuid(funds[0].fundUUID)
		}
	}, [funds])

	if (funds.length === 0) {
		return (
			<div className="shrink-0">
				<Button
					onClick={(): void => fundsClass.setIsCreateFundDialogOpen(true)}
					className={cn(
						"h-12! w-80 rounded-full bg-off-sidebar-blue! border-none shadow-none",
						"focus-visible:ring-0 focus-visible:ring-offset-0",
						"text-base pl-5 flex items-center gap-2 text-button-text"
					)}
				>
					<Plus className="h-5 w-5" />
					<span>Create Fund</span>
				</Button>
			</div>
		)
	}

	const handleFundChange = (value: string): void => {
		if (value === "create-fund") {
			fundsClass.setIsCreateFundDialogOpen(true)
			return
		}
		const fundUUID = value as FundsUUID
		fundsClass.setSelectedFundUuid(fundUUID)
		// Set the new fund as primary
		setPrimaryFund(fundUUID)
	}

	const selectedFund = funds.find((fund: SingleFund): boolean => fund.fundUUID === fundsClass.selectedFundUuid) || funds[0]

	return (
		<div className="shrink-0">
			<Select
				value={fundsClass.selectedFundUuid || funds[0]?.fundUUID}
				onValueChange={handleFundChange}
			>
				<SelectTrigger
					className={cn(
						"h-12! w-80 rounded-full bg-off-sidebar-blue! border-none shadow-none",
						"focus-visible:ring-0 focus-visible:ring-offset-0",
						"**:data-select-icon:text-button-text! **:data-select-icon:opacity-100!",
						"text-base pl-5 cursor-pointer"
					)}
				>
					<SelectValue>
						{selectedFund?.fundName || ""}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{funds.map((fund: SingleFund): React.ReactNode => (
						<SelectItem
							key={fund.fundUUID}
							value={fund.fundUUID}
							className="cursor-pointer"
						>
							<div className="flex items-center justify-between w-full gap-2">
								<span>{fund.fundName} - ${formatCurrency(fund.currentAccountCashBalanceUsd + fund.positionsValueUsd)}</span>
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"h-auto p-1 hover:bg-transparent text-button-text",
										"hover:text-yes-green text-xs pointer-events-auto"
									)}
									onMouseDown={(e): void => {
										e.preventDefault()
										e.stopPropagation()
										navigate(`/funds/${fund.fundUUID}`)
									}}
								>
									Go to fund
								</Button>
							</div>
						</SelectItem>
					))}
					<SelectItem
						value="create-fund"
						className="cursor-pointer"
						onSelect={(): void => {
							fundsClass.setIsCreateFundDialogOpen(true)
						}}
					>
						<div className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							<span>Create a fund</span>
						</div>
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}

export default observer(FundsDropdown)
