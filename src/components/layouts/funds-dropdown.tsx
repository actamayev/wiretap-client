"use client"

import { useState, useMemo } from "react"
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

function FundsDropdown(): React.ReactNode {
	const [selectedFundUUID, setSelectedFundUUID] = useState<FundsUUID | "">("")

	const funds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

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

	return (
		<div className="shrink-0">
			<Select
				value={selectedFundUUID || funds[0]?.fundUUID}
				onValueChange={(value): void => setSelectedFundUUID(value as FundsUUID)}
			>
				<SelectTrigger
					className={cn(
						"h-12! w-80 rounded-full bg-off-sidebar-blue! border-none shadow-none",
						"focus-visible:ring-0 focus-visible:ring-offset-0",
						"**:data-select-icon:text-button-text! **:data-select-icon:opacity-100!",
						"text-base pl-5"
					)}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{funds.map((fund: SingleFund): React.ReactNode => (
						<SelectItem key={fund.fundUUID} value={fund.fundUUID}>
							{fund.fundName}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

export default observer(FundsDropdown)
