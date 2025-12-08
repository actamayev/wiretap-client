"use client"

import { observer } from "mobx-react"
import { cn } from "../../lib/utils"
import HeaderContent from "./internal-header"

interface InternalContainerLayoutProps {
	children: React.ReactNode
	extraChildrenClasses?: string
	extraParentClasses?: string
	preventElasticScroll?: boolean
}

function InternalContainerLayout(props: InternalContainerLayoutProps): React.ReactNode {
	const {
		children,
		extraChildrenClasses = "",
		extraParentClasses = "",
		preventElasticScroll = false
	} = props

	return (
		<div className={cn("h-screen flex flex-col w-full bg-sidebar-blue", extraParentClasses)}>
			{/* Header */}
			<header className="bg-sidebar-blue py-3">
				<HeaderContent />
			</header>

			{/* Main content area with hidden scrollbar */}
			<div
				className={cn(
					"flex-1 overflow-y-auto scrollbar-hide bg-off-sidebar-blue mr-6 rounded-tl-lg rounded-tr-lg",
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
