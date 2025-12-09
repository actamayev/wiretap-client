"use client"

import { useState, useEffect } from "react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import PortfolioStats from "./portfolio-stats"
import FeedbackDialog from "./feedback-dialog"
import FundsDropdown from "./funds-dropdown"
import SearchBar from "./search-bar"

export default function HeaderContent(): React.ReactNode {
	const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)

	useEffect((): (() => void) => {
		const handleKeyDown = (e: KeyboardEvent): void => {
			// Open feedback dialog with "f" key
			const target = e.target as HTMLElement
			const isInputElement = ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)
			const isSelectTrigger = target?.closest("[data-slot=\"select-trigger\"]")

			if (e.key === "f" && !isInputElement && !isSelectTrigger) {
				e.preventDefault()
				setIsFeedbackDialogOpen(true)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return (): void => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

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
