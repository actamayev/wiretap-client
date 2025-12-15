"use client"

import { useEffect } from "react"
import { observer } from "mobx-react"
import authClass from "@/classes/auth-class"
import SidebarLayout from "./sidebar-layout"

interface LayoutWrapperProps {
	children: React.ReactNode
	userId: number | null
}

function LayoutWrapper({ children, userId }: LayoutWrapperProps): React.ReactNode {
	// Sync server auth state with client
	// Always sync to catch cases where server state changes (e.g., after Google login)
	useEffect((): void => {
		// Sync when client is not logged in, or when server indicates incomplete signup
		// This ensures we catch Google login -> incomplete signup transitions
		if (!authClass.isLoggedIn && userId !== null) {
			authClass.setIsAuthenticated(true)
		} else if (authClass.isLoggedIn && userId === null) {
			// If client thinks user is logged in but server says incomplete signup, sync it
			authClass.setIsAuthenticated(false)
		}
	}, [userId])

	return (
		<SidebarLayout>
			{children}
		</SidebarLayout>
	)
}

export default observer(LayoutWrapper)
