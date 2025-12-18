"use client"

import { observer } from "mobx-react"
import HeaderContent from "./header-content"
import CreateFundDialog from "../funds/funds-page/create-fund-dialog"
import RegisterDialog from "../register-dialog"
import FeedbackDialog from "./feedback-dialog"

function ContainerLayout(props: { children: React.ReactNode }): React.ReactNode {
	const { children } = props

	return (
		<div className="h-screen flex flex-col w-full bg-sidebar-blue">
			{/* Header */}
			<header
				className="bg-sidebar-blue md:mr-6"
				style={{ paddingBlock: "18px" }}
			>
				<HeaderContent />
			</header>

			{/* Main content area with hidden scrollbar */}
			<div
				className={"flex-1 overflow-y-auto scrollbar-hide bg-off-sidebar-blue md:mr-6 rounded-tl-3xl rounded-tr-3xl"}
				style={{
					/* Firefox */
					scrollbarWidth: "none",
					/* IE and Edge */
					msOverflowStyle: "none",
					/* Allow vertical scrolling but preserve horizontal swipe gestures */
					touchAction: "pan-y",
					overscrollBehaviorY: "none",
					overscrollBehaviorX: "auto", // Allow horizontal overscroll for swipe-back
				}}
			>
				{children}
			</div>
			<CreateFundDialog />
			<RegisterDialog />
			<FeedbackDialog />
		</div>
	)
}

export default observer(ContainerLayout)
