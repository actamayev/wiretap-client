/* eslint-disable max-len */
import { useMemo, useRef, useEffect } from "react"
import { observer } from "mobx-react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose
} from "../../ui/dialog"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import fundsClass from "../../../classes/funds-class"
import createFund from "../../../utils/funds/create-fund"
import { cn } from "../../../lib/utils"

const addCommas = (num: string | number): string => {
	const numStr = num.toString()
	return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const removeNonNumeric = (num: string): string => {
	return num.toString().replace(/[^0-9]/g, "")
}

// eslint-disable-next-line max-lines-per-function
function CreateFundDialog(): React.ReactNode {
	const fundNameInputRef = useRef<HTMLInputElement>(null)

	const isValid = useMemo((): boolean => {
		const fundName = fundsClass.createFundData.fundName.trim()
		const balance = fundsClass.createFundData.startingAccountCashBalanceUsd

		return (
			fundName.length >= 3 &&
			fundName.length <= 100 &&
			balance >= 10 &&
			balance <= 1_000_000
		)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.createFundData.fundName, fundsClass.createFundData.startingAccountCashBalanceUsd])

	// Focus the input when dialog opens - using requestAnimationFrame for instant feel
	useEffect((): void => {
		if (fundsClass.isCreateFundDialogOpen) {
			const focusInput = (): void => {
				if (fundNameInputRef.current) {
					fundNameInputRef.current.focus()
					fundNameInputRef.current.select()
				}
			}

			// Use double requestAnimationFrame for maximum speed
			requestAnimationFrame((): void => {
				requestAnimationFrame(focusInput)
			})
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.isCreateFundDialogOpen])

	const handleCreateFund = async (): Promise<void> => {
		const fundUUID = await createFund()
		if (fundUUID !== undefined) {
			fundsClass.setIsCreateFundDialogOpen(false)
		}
	}

	return (
		<Dialog open={fundsClass.isCreateFundDialogOpen} onOpenChange={fundsClass.setIsCreateFundDialogOpen}>
			<DialogContent className="max-w-2xl border border-white/30 bg-sidebar-blue " onClick={(e): void => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle className="text-2xl">Create Fund</DialogTitle>
					<DialogClose />
				</DialogHeader>
				<Input
					ref={fundNameInputRef}
					id="fundName"
					value={fundsClass.createFundData.fundName}
					onChange={(e): void => fundsClass.setCreateFundKey("fundName", e.target.value)}
					placeholder="Fund name"
					className="w-full text-xl! h-10 focus-visible:ring-0 focus-visible:ring-offset-0 border-white/30 focus:border-white/30 focus-visible:border-white/30 active:border-white/30"
					maxLength={100}
					autoFocus
				/>
				<div className="relative">
					<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-muted-foreground">$</span>
					<Input
						type="text"
						inputMode="numeric"
						placeholder="Starting account balance (USD)"
						value={
							fundsClass.createFundData.startingAccountCashBalanceUsd === 0
								? ""
								: addCommas(fundsClass.createFundData.startingAccountCashBalanceUsd)
						}
						onChange={(e): void => {
							const numericValue = removeNonNumeric(e.target.value)
							// Convert to number, or keep as 0 if empty
							let numValue = numericValue === "" ? 0 : Number(numericValue)
							// Cap at maximum of 1,000,000
							if (numValue > 1_000_000) {
								numValue = 1_000_000
							}
							fundsClass.setCreateFundKey("startingAccountCashBalanceUsd", numValue)
						}}
						className="w-full text-xl! h-10 focus-visible:ring-0 focus-visible:ring-offset-0 pl-8 border-white/30 focus:border-white/30 focus-visible:border-white/30 active:border-white/30"
					/>
				</div>
				<DialogFooter className="flex justify-end gap-2">
					<Button
						onClick={(): void => fundsClass.setIsCreateFundDialogOpen(false)}
						className={cn(
							"flex-1 h-10 rounded-xl text-lg",
							"border-input bg-transparent dark:bg-input/30 dark:hover:bg-input/50",
							"border shadow-xs transition-[color,box-shadow]",
							"focus-visible:ring-0 focus-visible:ring-offset-0 text-button-text"
						)}
					>
						Cancel
					</Button>
					<Button
						onClick={handleCreateFund}
						disabled={!isValid}
						className={cn(
							"flex-1 h-10 rounded-xl text-lg",
							"border-input bg-transparent dark:bg-input/30 dark:hover:bg-input/50",
							"border shadow-xs transition-[color,box-shadow]",
							"focus-visible:ring-0 focus-visible:ring-offset-0 text-button-text",
							"disabled:opacity-50 disabled:cursor-not-allowed"
						)}
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog >
	)
}

export default observer(CreateFundDialog)
