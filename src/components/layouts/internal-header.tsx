"use client"

import { useState } from "react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import PortfolioStats from "./portfolio-stats"
import FeedbackDialog from "./feedback-dialog"
import FundsDropdown from "./funds-dropdown"
import SearchBar from "./search-bar"

export default function HeaderContent(): React.ReactNode {
	const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)

	return (
		<div className="flex items-center justify-between w-full">
			{/* Search Bar */}
			<SearchBar />

			<FundsDropdown />

			<PortfolioStats />

			{/* Feedback Button */}
			<Button
				onClick={(): void => setIsFeedbackDialogOpen(true)}
				className={cn("shrink-0 rounded-full bg-off-sidebar-blue! border-none shadow-none",
					"h-12 px-4 hover:bg-off-sidebar-blue/80 flex items-center gap-2"
				)}
			>
				<span className="text-button-text text-base">Feedback</span>
			</Button>

			<FeedbackDialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen} />
		</div>
	)
}
