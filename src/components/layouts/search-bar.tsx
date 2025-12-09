"use client"

import { useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { cn } from "../../lib/utils"
import { Input } from "../ui/input"
import eventsClass from "../../classes/events-class"
import { observer } from "mobx-react"

function SearchBar(): React.ReactNode {
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
		}

		window.addEventListener("keydown", handleKeyDown)
		return (): void => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	return (
		<div className="flex-1 max-w-lg relative">
			<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-button-text" />
			<Input
				ref={searchInputRef}
				type="search"
				placeholder="Search events"
				value={eventsClass.searchTerm}
				onChange={(e): void => eventsClass.setSearchTerm(e.target.value)}
				className={cn(
					"pl-12 rounded-full bg-off-sidebar-blue! border-none text-button-text! placeholder:text-button-text!",
					"shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base!",
					"[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
				)}
			/>
		</div>
	)
}

export default observer(SearchBar)
