"use client"

import { cn } from "../../lib/utils"

interface EventRulesProps {
	description: string | undefined
}

export default function EventRules({ description }: EventRulesProps): React.ReactNode {
	return (
		<div className="bg-sidebar-blue rounded-lg p-4 flex flex-col min-h-0 border-2 border-white/30">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-semibold">Rules</h3>
			</div>
			<div className={cn(
				"text-sm text-muted-foreground overflow-y-auto flex-1 min-h-0 whitespace-pre-line",
				"[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
			)}>
				{description || "No rules specified for this event."}
			</div>
		</div>
	)
}
