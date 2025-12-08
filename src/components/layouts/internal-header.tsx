"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import PortfolioStats from "./portfolio-stats"
import FeedbackDialog from "./feedback-dialog"
import FundsDropdown from "./funds-dropdown"

export default function HeaderContent(): React.ReactNode {
	const [searchQuery, setSearchQuery] = useState("")
	const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
	const searchInputRef = useRef<HTMLInputElement>(null)

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

			// Open feedback dialog with "f" key
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
