
"use client"

import { observer } from "mobx-react"
import { useEffect, useRef } from "react"
import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog"
import SignupForm from "@/components/signup-form"
import LoginForm from "@/components/login-form"
import authClass from "@/classes/auth-class"
import useTypedNavigate from "@/hooks/navigate/use-typed-navigate"
import tradeClass from "@/classes/trade-class"

function RegisterDialog(): React.ReactNode {
	const navigate = useTypedNavigate()
	const hasNavigatedRef = useRef(false)

	useEffect((): void => {
		if (!authClass.showRegisterDialog) return
		authClass.setShowLoginOrRegister("Register")
		hasNavigatedRef.current = false
	}, [])

	useEffect((): void => {
		if (
			!authClass.showRegisterDialog ||
			!authClass.isLoggedIn ||
			hasNavigatedRef.current
		) return
		hasNavigatedRef.current = true

		// If there's pending navigation (event interaction), handle it
		const pendingNavigation = authClass.pendingNavigation
		const event = authClass.pendingEvent
		if (!pendingNavigation) {
			// No pending navigation - just close the dialog
			authClass.setShowRegisterDialog(false)
			return
		}
		// If market is specified (First/Second outcome button click), set trade state
		if (pendingNavigation.outcomeIndex !== undefined && event?.eventMarkets?.[0]) {
			const market = event.eventMarkets[0]
			tradeClass.setSelectedOutcomeIndex(pendingNavigation.outcomeIndex as 0 | 1)
			tradeClass.setMarketId(market.marketId)
			tradeClass.setSelectedClobToken(market.outcomes[pendingNavigation.outcomeIndex].clobTokenId)
		}
		// Close the dialog first
		authClass.setShowRegisterDialog(false)
		// Then navigate to the event page after a brief delay to ensure dialog closes
		setTimeout((): void => {
			navigate(`/event/${pendingNavigation.eventSlug}`)
		}, 100)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authClass.showRegisterDialog, navigate, authClass.isLoggedIn, authClass.pendingNavigation, authClass.pendingEvent])

	// Access authClass properties in render to ensure MobX observer tracks them
	// This ensures the component re-renders when auth state changes
	const showLoginOrRegister = authClass.showLoginOrRegister

	return (
		<Dialog open={authClass.showRegisterDialog} onOpenChange={authClass.setShowRegisterDialog}>
			<DialogContent className="max-h-[90vh] overflow-y-auto border border-white/30 bg-sidebar-blue">
				{showLoginOrRegister === "Login" ? (
					<LoginForm extraClasses="border-none" />
				) : (
					<SignupForm extraClasses="border-none" />
				)}
			</DialogContent>
		</Dialog>
	)
}

export default observer(RegisterDialog)
