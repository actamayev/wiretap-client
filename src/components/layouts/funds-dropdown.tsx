"use client"

import { useState, useMemo } from "react"
import { observer } from "mobx-react"
import { cn } from "../../lib/utils"
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

	return (
		<div className="shrink-0">
			<Select
				value={selectedFundUUID || "all"}
				onValueChange={(value): void => setSelectedFundUUID(value === "all" ? "" : value as FundsUUID)}
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
					<SelectItem value="all">All Funds</SelectItem>
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
