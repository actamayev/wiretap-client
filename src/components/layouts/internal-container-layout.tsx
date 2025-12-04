"use client"

import { useState, useMemo } from "react"
import { observer } from "mobx-react"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"
import { Input } from "../ui/input"
import fundsClass from "../../classes/funds-class"

interface InternalContainerLayoutProps {
	children: React.ReactNode
	extraChildrenClasses?: string
	extraParentClasses?: string
	preventElasticScroll?: boolean
}

interface PortfolioStats {
	totalFunds: number
	totalBalance: number
	totalStartingBalance: number
	totalPnL: number
}

function HeaderContent(): React.ReactNode {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedFundUUID, setSelectedFundUUID] = useState<FundsUUID | "">("")

	const funds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

	const portfolioStats = useMemo((): PortfolioStats => {
		const totalFunds = funds.length
		const totalBalance = funds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.currentAccountBalanceUsd, 0)
		const totalStartingBalance = funds.reduce((sum: number, fund: SingleFund): number =>
			sum + fund.startingAccountBalanceUsd, 0)
		const totalPnL = totalBalance - totalStartingBalance

		return {
			totalFunds,
			totalBalance,
			totalStartingBalance,
			totalPnL
		}
	}, [funds])

	const formatCurrency = (value: number): string => {
		return value.toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	}

	return (
		<div className="flex items-center gap-6 w-full">
			{/* Search Bar */}
			<div className="flex-1 max-w-md relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search..."
					value={searchQuery}
					onChange={(e): void => setSearchQuery(e.target.value)}
					className="pl-9"
				/>
			</div>

			{/* Fund Dropdown */}
			<div className="shrink-0">
				<select
					value={selectedFundUUID}
					onChange={(e): void => setSelectedFundUUID(e.target.value as FundsUUID | "")}
					className={cn(
						"h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm",
						"shadow-xs transition-[color,box-shadow] outline-none",
						"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
					)}
				>
					<option value="">All Funds</option>
					{funds.map((fund: SingleFund): React.ReactNode => (
						<option key={fund.fundUUID} value={fund.fundUUID}>
							{fund.fundName}
						</option>
					))}
				</select>
			</div>

			{/* Portfolio Stats */}
			<div className="shrink-0 flex items-center gap-6">
				<div className="text-right">
					<div className="text-xs text-muted-foreground">Total Funds</div>
					<div className="text-sm font-semibold">{portfolioStats.totalFunds}</div>
				</div>
				<div className="text-right">
					<div className="text-xs text-muted-foreground">Total Balance</div>
					<div className="text-sm font-semibold">
						${formatCurrency(portfolioStats.totalBalance)}
					</div>
				</div>
				<div className="text-right">
					<div className="text-xs text-muted-foreground">Total P&L</div>
					<div className={cn(
						"text-sm font-semibold",
						portfolioStats.totalPnL >= 0 ? "text-green-600" : "text-red-600"
					)}>
						{portfolioStats.totalPnL >= 0 ? "+" : ""}
						${formatCurrency(portfolioStats.totalPnL)}
					</div>
				</div>
			</div>
		</div>
	)
}

const ObservedHeaderContent = observer(HeaderContent)

function InternalContainerLayout(props: InternalContainerLayoutProps): React.ReactNode {
	const {
		children,
		extraChildrenClasses = "",
		extraParentClasses = "",
		preventElasticScroll = false
	} = props

	return (
		<div className={cn("h-screen flex flex-col w-full", extraParentClasses)}>
			{/* Header */}
			<header className="border-b border-border bg-background px-6 py-4">
				<ObservedHeaderContent />
			</header>

			{/* Main content area with hidden scrollbar */}
			<div
				className={cn(
					"flex-1 overflow-y-auto scrollbar-hide",
					preventElasticScroll ? "overscroll-none" : "",
					extraChildrenClasses
				)}
				style={{
					/* Firefox */
					scrollbarWidth: "none",
					/* IE and Edge */
					msOverflowStyle: "none",
				}}
			>
				{children}
			</div>
		</div>
	)
}

export default observer(InternalContainerLayout)
