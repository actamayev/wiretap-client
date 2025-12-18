"use client"

import { observer } from "mobx-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import PortfolioStats from "./portfolio-stats"
import FundsDropdown from "./funds-dropdown"
import SearchBar from "./search-bar"
import authClass from "../../classes/auth-class"

function HeaderContent(): React.ReactNode {
	const handleFeedbackClick = (): void => {
		if (!authClass.isLoggedIn) {
			authClass.setShowRegisterDialog(true)
			return
		}
		authClass.setShowFeedbackDialog(true)
	}

	return (
		<div className="flex items-center justify-between w-full">
			{/* Search Bar */}
			<SearchBar />

			<FundsDropdown />

			<PortfolioStats />

			{/* Feedback Button */}
			<Button
				onClick={handleFeedbackClick}
				className={cn("shrink-0 rounded-full bg-off-sidebar-blue! border-none shadow-none",
					"h-12 px-4 hover:bg-off-sidebar-blue/80 flex items-center gap-2"
				)}
			>
				<span className="text-button-text text-base">Feedback</span>
			</Button>
		</div>
	)
}

export default observer(HeaderContent)
