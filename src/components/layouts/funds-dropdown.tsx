"use client"

import { useMemo, useEffect, useState } from "react"
import { observer } from "mobx-react"
import { Plus, CheckIcon } from "lucide-react"
import * as SelectPrimitive from "@radix-ui/react-select"
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
import CustomTooltip from "../custom-tooltip"
import authClass from "../../classes/auth-class"
import RegisterDialog from "../register-dialog"

function SelectItemWithTooltip({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>): React.ReactNode {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				"bg-off-sidebar-blue focus:bg-off-sidebar-blue-hover focus:text-accent-foreground",
				"[&_svg:not([class*='text-'])]:text-muted-foreground",
				"relative flex w-full cursor-default items-center gap-2 rounded-sm",
				"py-1.5 pr-8 pl-2 text-sm outline-hidden select-none",
				"data-disabled:pointer-events-none data-disabled:opacity-50",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				"[&_svg:not([class*='size-'])]:size-4",
				"*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				"[&_span[class*='pointer-events-auto']_svg]:pointer-events-auto",
				className
			)}
			{...props}
		>
			<span className="absolute right-2 flex size-3.5 items-center justify-center pointer-events-auto [&_svg]:pointer-events-auto">
				<SelectPrimitive.ItemIndicator>
					<CustomTooltip
						tooltipTrigger={
							<div className="cursor-pointer">
								<CheckIcon className="size-4" />
							</div>
						}
						tooltipContent="This is your currently selected fund"
					/>
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	)
}

// eslint-disable-next-line max-lines-per-function
function FundsDropdown(): React.ReactNode {
	const navigate = useTypedNavigate()
	const [showRegisterDialog, setShowRegisterDialog] = useState(false)
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

	const handleCreateFundClick = (): void => {
		if (!authClass.isLoggedIn) {
			setShowRegisterDialog(true)
			return
		}
		fundsClass.setIsCreateFundDialogOpen(true)
	}

	if (funds.length === 0) {
		return (
			<>
				<div className="shrink-0">
					<Button
						onClick={handleCreateFundClick}
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
				<RegisterDialog
					open={showRegisterDialog}
					onOpenChange={setShowRegisterDialog}
				/>
			</>
		)
	}

	const handleFundChange = (value: string): void => {
		if (value === "create-fund") {
			if (!authClass.isLoggedIn) {
				setShowRegisterDialog(true)
				return
			}
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
				<SelectContent className="bg-off-sidebar-blue">
					{funds.map((fund: SingleFund): React.ReactNode => (
						<SelectItemWithTooltip
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
						</SelectItemWithTooltip>
					))}
					<SelectItem
						value="create-fund"
						className="cursor-pointer"
						onSelect={(): void => {
							if (!authClass.isLoggedIn) {
								setShowRegisterDialog(true)
								return
							}
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
			<RegisterDialog
				open={showRegisterDialog}
				onOpenChange={setShowRegisterDialog}
			/>
		</div>
	)
}

export default observer(FundsDropdown)
