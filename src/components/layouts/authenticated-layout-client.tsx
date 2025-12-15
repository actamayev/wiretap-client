"use client"
import { observer } from "mobx-react"
import { usePathname } from "next/navigation"
import authClass from "@/classes/auth-class"
import LoginForm from "@/components/login-form"
import SignupForm from "@/components/signup-form"

interface AuthenticatedLayoutClientProps {
	children: React.ReactNode
	userId: number | null
}

function checkRequiresAuth(pathname: string): boolean {
	return pathname === "/funds" ||
		pathname === "/profile" ||
		pathname.startsWith("/funds/")
}

function getIsAuthenticated(userId: number | null): boolean {
	return authClass.isLoggingOut
		? authClass.isLoggedIn
		: (authClass.isLoggedIn || userId !== null)
}

function AuthenticatedLayoutClient({
	children,
	userId
}: AuthenticatedLayoutClientProps): React.ReactNode {
	const pathname = usePathname()
	const isAuthenticated = getIsAuthenticated(userId)

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
				{authClass.showLoginOrRegister === "Login" ? (
					<LoginForm extraClasses="bg-sidebar-blue border-2 border-white/30" />
				) : (
					<SignupForm extraClasses="bg-sidebar-blue border-2 border-white/30" />
				)}
			</div>
		</div>
	)
}

export default observer(AuthenticatedLayoutClient)
