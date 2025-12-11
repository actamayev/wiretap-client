"use client"
import { observer } from "mobx-react"
import { usePathname } from "next/navigation"
import authClass from "@/classes/auth-class"
import { AuthState } from "@/lib/auth-server"
import LoginForm from "@/components/login-form"
import SignupForm from "@/components/signup-form"
import { GoogleUsernameForm } from "@/components/google-username-form"

interface AuthenticatedLayoutClientProps {
	children: React.ReactNode
	authState: AuthState
}

function checkRequiresAuth(pathname: string): boolean {
	return pathname === "/funds" ||
		pathname === "/profile" ||
		pathname.startsWith("/funds/")
}

function getIsAuthenticated(authState: AuthState): boolean {
	return authClass.isLoggingOut
		? authClass.isLoggedIn
		: (authClass.isLoggedIn || authState.isAuthenticated)
}

function getIsIncompleteSignup(authState: AuthState, isAuthenticated: boolean): boolean {
	// Check server state first
	if (authState.isIncompleteSignup) return true
	// Also check client state - if authenticated but hasn't completed signup
	if (isAuthenticated && !authClass.isFinishedWithSignup) return true
	// Fallback to server state check
	return isAuthenticated && !authState.hasCompletedSignup && authState.userId !== null
}

function AuthenticatedLayoutClient({
	children,
	authState
}: AuthenticatedLayoutClientProps): React.ReactNode {
	const pathname = usePathname()
	const isAuthenticated = getIsAuthenticated(authState)
	const isIncompleteSignup = getIsIncompleteSignup(authState, isAuthenticated)

	// If incomplete signup, show Google username form
	// Constrain width and center the form
	if (isIncompleteSignup) {
		return (
			<div className="flex items-center justify-center min-h-full p-6">
				<div className="w-full max-w-md">
					<GoogleUsernameForm />
				</div>
			</div>
		)
	}

	// If authenticated and complete, show the protected content
	if (isAuthenticated) {
		return (
			<div className="text-question-text">
				{children}
			</div>
		)
	}

	// If path doesn't require auth, show content without form
	if (!checkRequiresAuth(pathname)) {
		return (
			<div className="text-question-text">
				{children}
			</div>
		)
	}

	// Show login or signup form based on authClass.showLoginOrRegister
	// Constrain width and center the form on protected pages
	return (
		<div className="flex items-center justify-center min-h-full p-6">
			<div className="w-full max-w-md">
				{authClass.showLoginOrRegister === "Login" ? <LoginForm /> : <SignupForm />}
			</div>
		</div>
	)
}

export default observer(AuthenticatedLayoutClient)
