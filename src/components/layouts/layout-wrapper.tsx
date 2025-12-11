"use client"

import { useEffect } from "react"
import { observer } from "mobx-react"
import { AuthState } from "@/lib/auth-server"
import authClass from "../../classes/auth-class"
import InternalPagesLayout from "./internal-pages-layout"

interface LayoutWrapperProps {
	children: React.ReactNode
	initialAuthState: AuthState
}

function LayoutWrapper({ children, initialAuthState }: LayoutWrapperProps): React.ReactNode {
	// Sync server auth state with client
	// Always sync to catch cases where server state changes (e.g., after Google login)
	useEffect((): void => {
		// Sync when client is not logged in, or when server indicates incomplete signup
		// This ensures we catch Google login -> incomplete signup transitions
		if (!authClass.isLoggedIn && initialAuthState.isAuthenticated) {
			authClass.setAuthState({
				isAuthenticated: initialAuthState.isAuthenticated,
				hasCompletedSignup: initialAuthState.hasCompletedSignup
			})
		} else if (authClass.isLoggedIn && initialAuthState.isIncompleteSignup) {
			// If client thinks user is logged in but server says incomplete signup, sync it
			authClass.setAuthState({
				isAuthenticated: initialAuthState.isAuthenticated,
				hasCompletedSignup: false
			})
		}
	}, [initialAuthState.isAuthenticated, initialAuthState.hasCompletedSignup, initialAuthState.isIncompleteSignup])

	return (
		<InternalPagesLayout>
			{children}
		</InternalPagesLayout>
	)
}

export default observer(LayoutWrapper)
