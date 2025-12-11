"use client"

import { observer } from "mobx-react"
import { cn } from "../../lib/utils"
import HeaderContent from "./internal-header"
import CreateFundDialog from "../funds/funds-page/create-fund-dialog"

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
			<header
				className="bg-sidebar-blue mr-6"
				style={{ paddingBlock: "18px" }}
			>
				<HeaderContent />
			</header>

			{/* Main content area with hidden scrollbar */}
			<div
				className={cn(
					"flex-1 overflow-y-auto scrollbar-hide bg-off-sidebar-blue mr-6 rounded-tl-3xl rounded-tr-3xl",
					extraChildrenClasses
				)}
				style={{
					/* Firefox */
					scrollbarWidth: "none",
					/* IE and Edge */
					msOverflowStyle: "none",
					/* Allow vertical scrolling but preserve horizontal swipe gestures */
					touchAction: "pan-y",
					overscrollBehaviorY: preventElasticScroll ? "none" : "auto",
					overscrollBehaviorX: "auto", // Allow horizontal overscroll for swipe-back
				}}
			>
				{children}
			</div>
			<CreateFundDialog />
		</div>
	)
}

export default observer(InternalContainerLayout)
