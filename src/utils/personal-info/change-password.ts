/* eslint-disable max-depth */
"use client"

import { AxiosError } from "axios"
import isEqual from "lodash-es/isEqual"
import authClass from "../../classes/auth-class"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import { isMessageResponse, isNonSuccessResponse, isValidationErrorResponse } from "../type-checks"

// eslint-disable-next-line complexity
export default async function changePassword(
	oldPassword: string,
	newPassword: string
) : Promise<string | null> {
	try {
		if (authClass.isFinishedWithSignup === false) {
			return "You must be logged in to change your password"
		}

		if (oldPassword === newPassword) {
			return "New password must be different from your current password"
		}

		if (oldPassword.length < 6) {
			return "Current password must be at least 6 characters"
		}

		if (newPassword.length < 6) {
			return "New password must be at least 6 characters"
		}

		const updatePasswordResponse = await wiretapApiClient.personalInfoDataService.changePassword(
			oldPassword, newPassword
		)

		if (!isEqual(updatePasswordResponse.status, 200) || isNonSuccessResponse(updatePasswordResponse.data)) {
			throw Error("Unable to change password")
		}

		return null // Success, no error
	} catch (error: unknown) {
		console.error(error)
		if (error instanceof AxiosError) {
			// Check for specific error types
			if (error.response?.status === 400) {
				if (isMessageResponse(error.response.data)) {
					if (error.response.data.message === "Wrong password. Please try again.") {
						return "Incorrect current password"
					}
					if (error.response.data.message === "Your new password can't be the same as the old password") {
						return "New password can't be the same as your current password"
					}
					if (error.response.data.message === "Please log in with Google") {
						return "Password change not available for Google accounts"
					}
					return error.response.data.message
				}
				if (isValidationErrorResponse(error.response.data) && error.response.data.validationError) {
					return error.response.data.validationError
				}
				return "Invalid password format"
			}

			if (error.response?.status === 500) {
				return "Server error occurred"
			}
		}

		return "An unexpected error occurred"
	}
}
