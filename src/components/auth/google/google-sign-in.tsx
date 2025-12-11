"use client"

import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import useGoogleAuthCallback from "../../../hooks/google-auth/use-google-auth-callback"
import { useCallback } from "react"

export default function GoogleSignIn(): React.ReactNode {
	const googleAuthCallback = useGoogleAuthCallback()

	const onSuccess = useCallback(async (successResponse: CredentialResponse): Promise<void> => {
		await googleAuthCallback(successResponse)
		// User stays on current page after Google sign-in
		// If incomplete signup (new user), GoogleUsernameForm will be shown automatically
		// via authenticated-layout-client.tsx
	}, [googleAuthCallback])

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
