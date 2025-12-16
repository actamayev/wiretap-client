
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

interface RegisterDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	pendingNavigation?: {
		eventSlug: EventSlug
		outcomeIndex?: number
	} | null
	event?: SingleEvent
}

function RegisterDialog({ open, onOpenChange, pendingNavigation, event }: RegisterDialogProps): React.ReactNode {
	const navigate = useTypedNavigate()
	const hasNavigatedRef = useRef(false)

	// Reset to Register form when dialog opens
	useEffect((): void => {
		if (open) {
			authClass.setShowLoginOrRegister("Register")
			hasNavigatedRef.current = false
		}
	}, [open])

	// Close dialog and navigate when user successfully registers or logs in
	// Access authClass properties directly in render so MobX observer can track them

	useEffect((): void => {
		if (open && authClass.isLoggedIn && !hasNavigatedRef.current) {
			hasNavigatedRef.current = true

			// If there's pending navigation (event interaction), handle it
			if (pendingNavigation) {
				// If market is specified (First/Second outcome button click), set trade state
				if (pendingNavigation.outcomeIndex !== undefined && event?.eventMarkets?.[0]) {
					const market = event.eventMarkets[0]
					tradeClass.setSelectedOutcomeIndex(pendingNavigation.outcomeIndex as 0 | 1)
					tradeClass.setMarketId(market.marketId)
					tradeClass.setSelectedClobToken(market.outcomes[pendingNavigation.outcomeIndex].clobTokenId)
				}
				// Close the dialog first
				onOpenChange(false)
				// Then navigate to the event page after a brief delay to ensure dialog closes
				setTimeout((): void => {
					navigate(`/event/${pendingNavigation.eventSlug}`)
				}, 100)
			} else {
				// No pending navigation - just close the dialog
				onOpenChange(false)
			}
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, onOpenChange, navigate, pendingNavigation, event, authClass.isLoggedIn])

	// Access authClass properties in render to ensure MobX observer tracks them
	// This ensures the component re-renders when auth state changes
	const showLoginOrRegister = authClass.showLoginOrRegister

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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
