"use client"

import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import useGoogleAuthCallback from "../../../hooks/google-auth/use-google-auth-callback"
import { useCallback } from "react"
import { useRouter } from "next/navigation"

export default function GoogleSignIn(): React.ReactNode {
	const googleAuthCallback = useGoogleAuthCallback()
	const router = useRouter()

	const onSuccess = useCallback(async (successResponse: CredentialResponse): Promise<void> => {
		const response = await googleAuthCallback(successResponse)
		// If new user (incomplete signup), refresh to get updated server auth state
		// This ensures the GoogleUsernameForm is shown immediately
		if (response?.isNewUser === true || !response?.personalInfo || response?.personalInfo?.username === null) {
			router.refresh()
		}
		// User stays on current page after Google sign-in
		// If incomplete signup (new user), GoogleUsernameForm will be shown automatically
		// via authenticated-layout-client.tsx after refresh
	}, [googleAuthCallback, router])

	return (
		<div className="flex justify-center">
			<GoogleLogin
				onSuccess={onSuccess}
				onError={(): void => console.error("Login Failed")}
				shape="pill"
				width={300}
				text="continue_with"
				logo_alignment="center"
			/>
		</div>
	)
}
