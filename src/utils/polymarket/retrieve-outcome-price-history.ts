import axios from "axios"
import { POLYMARKET_CLOB_URL } from "../constants/polymarket-constants"

interface PriceHistoryParams {
	market: string
	startTs?: number
	endTs?: number
	interval?: "1m" | "1w" | "1d" | "6h" | "1h" | "max"
	fidelity?: number
}

interface PriceHistoryResponse {
	history: PriceHistoryEntry[]
}

export default async function retrieveOutcomePriceHistory(params: PriceHistoryParams): Promise<PriceHistoryResponse> {
	try {
		const response = await axios.get<PriceHistoryResponse>(`${POLYMARKET_CLOB_URL}/prices-history`, {
			params
		})
		return response.data
	} catch (error) {
		console.error("Error retrieving outcome price history:", error)
		throw error
	}
}
