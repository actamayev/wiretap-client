"use client"

import { AxiosError } from "axios"
import isEqual from "lodash-es/isEqual"
import wiretapApiClient from "../classes/wiretap-api-client-class"
import { isMessageResponse, isNonSuccessResponse } from "./type-checks"

export default async function subscribeForUpdates(
	values: EmailUpdatesRequest,
	setIsLoading: (value: React.SetStateAction<boolean>) => void
): Promise <void> {
	try {
		if (!values.email) return
		setIsLoading(true)
		const subscribeForUpdatesResponse = await wiretapApiClient.miscDataService.subscribeForUpdates(values.email)
		if (!isEqual(subscribeForUpdatesResponse.status, 200) || isNonSuccessResponse(subscribeForUpdatesResponse.data)) {
			throw new Error("Email subscription failed")
		}
		return
	} catch (error) {
		console.error(error)
		if (error instanceof AxiosError && isMessageResponse(error.response?.data)) {
			return
		}
		return
	} finally {
		setIsLoading(false)
	}
}
