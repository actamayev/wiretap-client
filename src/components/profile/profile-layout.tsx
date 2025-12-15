"use client"

import { ReactNode } from "react"
import { observer } from "mobx-react"
import ProfileSidebar from "./profile-sidebar"
import authClass from "../../classes/auth-class"

interface SidebarLayoutProps {
	children: ReactNode
}

function ProfileLayout({ children }: SidebarLayoutProps): React.ReactNode {
	const isLoggedIn = (
		authClass.isLoggedIn ||
		authClass.isLoggingOut
	)

	return (
		<div className="relative">
			<div className={isLoggedIn ? "pr-[350px]" : ""}>
				{children}
			</div>
			{isLoggedIn && <ProfileSidebar />}
		</div>
	)
}

export default observer(ProfileLayout)
