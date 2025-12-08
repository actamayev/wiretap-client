"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { observer } from "mobx-react"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"
import { Input } from "../ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"
import PortfolioStats from "./portfolio-stats"
import fundsClass from "../../classes/funds-class"

function HeaderContent(): React.ReactNode {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedFundUUID, setSelectedFundUUID] = useState<FundsUUID | "">("")
	const searchInputRef = useRef<HTMLInputElement>(null)

	const funds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

	useEffect((): (() => void) => {
		const handleKeyDown = (e: KeyboardEvent): void => {
			// Only trigger if "/" is pressed and user isn't already typing in an input/textarea/select
			const target = e.target as HTMLElement
			const isInputElement = ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)
			const isSelectTrigger = target?.closest("[data-slot=\"select-trigger\"]")

			if (e.key === "/" && !isInputElement && !isSelectTrigger) {
				e.preventDefault()
				searchInputRef.current?.focus()
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return (): void => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	return (
		<div className="flex items-center gap-6 w-full">
			{/* Search Bar */}
			<div className="flex-1 max-w-lg relative">
				<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-button-text" />
				<Input
					ref={searchInputRef}
					type="search"
					placeholder="Search wiretap"
					value={searchQuery}
					onChange={(e): void => setSearchQuery(e.target.value)}
					className={cn(
						"pl-12 rounded-full bg-off-sidebar-blue! border-none text-button-text! placeholder:text-button-text!",
						"shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base!",
						"[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
					)}
				/>
			</div>

			{/* Fund Dropdown */}
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

			<PortfolioStats />
		</div>
	)
}

export default observer(HeaderContent)
