export const POLYMARKET_WS_URL = "wss://ws-subscriptions-clob.polymarket.com/ws/market"
export const PING_INTERVAL_MS = 10000 // 10 seconds as per Polymarket docs

export const POLYMARKET_CLOB_URL = "https://clob.polymarket.com"
export const timeframeConfig = {
	"1h": { label: "1H", interval: "1h" as const, fidelity: 1 },
	"1d": { label: "1D", interval: "1d" as const, fidelity: 5 },
	"1w": { label: "1W", interval: "1w" as const, fidelity: 30 },
	"1m": { label: "1M", interval: "1m" as const, fidelity: 180 },
	max: { label: "ALL", interval: "max" as const, fidelity: 720 }
} as const

