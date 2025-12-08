"use client"

import { AxiosError } from "axios"
import isEqual from "lodash-es/isEqual"
import wiretapApiClient from "../../classes/wiretap-api-client-class"
import { isMessageResponse, isNonSuccessResponse } from "../type-checks"

export default async function sendFeedback(
	feedback: string,
	setIsLoading: (value: React.SetStateAction<boolean>) => void
): Promise<boolean> {
	try {
		if (!feedback.trim()) return false
		setIsLoading(true)
		const sendFeedbackResponse = await wiretapApiClient.miscDataService.sendFeedback(feedback)
		if (!isEqual(sendFeedbackResponse.status, 200) || isNonSuccessResponse(sendFeedbackResponse.data)) {
			throw new Error("Feedback submission failed")
		}
		return true
	} catch (error) {
		console.error(error)
		if (error instanceof AxiosError && isMessageResponse(error.response?.data)) {
			console.error(error.response?.data.message)
		}
		return false
	} finally {
		setIsLoading(false)
	}
}
