"use client"

import { POLYMARKET_WS_URL, PING_INTERVAL_MS } from "../utils/constants/polymarket-websocket"
import eventsClass from "./events-class"
import fundsClass from "./funds-class"

interface WebSocketClientCallbacks {
	onPriceChange?: (message: PolymarketPriceChangeMessage) => void
	onLastTradePrice?: (message: PolymarketLastTradePriceMessage) => void
	onError?: (error: Error) => void
	onClose?: () => void
}

class PolymarketWebSocketClient {
	private ws: WebSocket | null = null
	private pingInterval: ReturnType<typeof setInterval> | null = null
	private clobTokenIds: ClobTokenId[] = []
	private callbacks: WebSocketClientCallbacks
	private isConnected = false

	constructor(callbacks: WebSocketClientCallbacks = {}) {
		this.callbacks = callbacks
	}

	/**
	 * Connect to Polymarket WebSocket and subscribe to markets
	 */
	public async connect(clobTokenIds: ClobTokenId[]): Promise<void> {
		if (this.isConnected) {
			console.warn("⚠️ WebSocket already connected, disconnecting first...")
			await this.disconnect()
		}

		this.clobTokenIds = clobTokenIds
		console.info(`🔌 Connecting to Polymarket WebSocket with ${clobTokenIds.length} assets...`)

		return new Promise<void>((resolve, reject): void => {
			this.ws = new WebSocket(POLYMARKET_WS_URL)

			this.ws.onopen = (): void => {
				console.info("✅ WebSocket connected")
				this.isConnected = true

				// Subscribe to market channel
				const subscription: MarketChannelSubscription = {
					type: "market",
					assets_ids: this.clobTokenIds
				}

				this.ws?.send(JSON.stringify(subscription))
				console.info(`📡 Subscribed to ${this.clobTokenIds.length} markets`)

				// Start ping interval
				this.startPingInterval()
				resolve()
			}

			this.ws.onmessage = (event: MessageEvent): void => {
				this.handleMessage(event.data)
			}

			this.ws.onerror = (error: Event): void => {
				console.error("❌ WebSocket error:", error)
				const errorObj = error instanceof Error ? error : new Error("WebSocket error occurred")
				this.callbacks.onError?.(errorObj)
				reject(errorObj)
			}

			this.ws.onclose = (): void => {
				console.info("🔌 WebSocket closed")
				this.isConnected = false
				this.stopPingInterval()
				this.callbacks.onClose?.()
			}
		})
	}

	/**
	 * Disconnect from WebSocket
	 */
	public disconnect(): Promise<void> {
		if (!this.ws) return Promise.resolve()

		console.info("🔌 Disconnecting WebSocket...")
		this.stopPingInterval()
		this.isConnected = false

		return new Promise<void>((resolve): void => {
			if (this.ws?.readyState === WebSocket.OPEN) {
				this.ws.close()
				this.ws.onclose = (): void => {
					this.ws = null
					resolve()
				}
			} else {
				this.ws = null
				resolve()
			}
		})
	}

	private handleMessage(data: string | Blob | ArrayBuffer): void {
		// Convert Blob or ArrayBuffer to string
		let messageStr: string
		if (typeof data === "string") {
			messageStr = data
		} else if (data instanceof Blob) {
			// Handle Blob by reading as text (async, but we'll handle it synchronously for now)
			const reader = new FileReader()
			reader.onload = (): void => {
				const text = reader.result as string
				this.processMessageString(text)
			}
			reader.readAsText(data)
			return
		} else {
			// ArrayBuffer - convert to string
			const decoder = new TextDecoder()
			messageStr = decoder.decode(data)
		}

		this.processMessageString(messageStr)
	}

	private processMessageString(messageStr: string): void {
		// Handle PONG responses (not JSON)
		if (messageStr === "PONG") return

		try {
			const parsed = JSON.parse(messageStr)

			// Handle array of messages (initial book snapshots)
			if (Array.isArray(parsed)) {
				for (const message of parsed) {
					this.processMessage(message)
				}
				return
			}

			// Handle single message
			this.processMessage(parsed)
		} catch (error) {
			console.error("Failed to parse WebSocket message:", error)
		}
	}

	/**
	 * Process a single WebSocket message
	 */
	private processMessage(message: PolymarketMarketChannelMessage): void {
		switch (message.event_type) {
			case "price_change":
				this.handlePriceChange(message)
				this.callbacks.onPriceChange?.(message)
				break

			case "last_trade_price":
				this.handleLastTradePrice(message)
				this.callbacks.onLastTradePrice?.(message)
				break

			case "book":
			// We don't process full order book snapshots
				break

			case "tick_size_change":
			// We don't track tick size changes
				break

			default:
				console.warn("Unknown WebSocket message type:", message)
		}
	}

	/**
	 * Handle price_change messages and update events class and funds class
	 */
	private handlePriceChange(message: PolymarketPriceChangeMessage): void {
		for (const priceChange of message.price_changes) {
			const bestBid = parseFloat(priceChange.best_bid)
			const bestAsk = parseFloat(priceChange.best_ask)

			// Calculate midpoint price
			const midpointPrice = (!isNaN(bestBid) && !isNaN(bestAsk) && bestBid > 0 && bestAsk > 0)
				? (bestBid + bestAsk) / 2
				: null

			const priceUpdate: PriceUpdate = {
				clobTokenId: priceChange.asset_id,
				midpointPrice
			}

			// Update events class with price update
			eventsClass.updateOutcomePrice(priceUpdate)
			// Update funds class with position price update
			fundsClass.updatePositionPrice(priceUpdate)
		}
	}

	/**
	 * Handle last_trade_price messages and update events class and funds class
	 */
	private handleLastTradePrice(message: PolymarketLastTradePriceMessage): void {
		const tradePrice = parseFloat(message.price)

		// Use trade price as midpoint (or could fetch current best bid/ask)
		const midpointPrice = !isNaN(tradePrice) && tradePrice > 0 ? tradePrice : null

		const priceUpdate: PriceUpdate = {
			clobTokenId: message.asset_id,
			midpointPrice
		}

		// Update events class with price update
		eventsClass.updateOutcomePrice(priceUpdate)
		// Update funds class with position price update
		fundsClass.updatePositionPrice(priceUpdate)
	}

	/**
	 * Start sending PING messages every 10 seconds
	 */
	private startPingInterval(): void {
		this.pingInterval = setInterval((): void => {
			if (this.ws?.readyState === WebSocket.OPEN) {
				this.ws.send("PING")
			}
		}, PING_INTERVAL_MS)
	}

	/**
	 * Stop PING interval
	 */
	private stopPingInterval(): void {
		if (!this.pingInterval) return
		clearInterval(this.pingInterval)
		this.pingInterval = null
	}

	/**
	 * Check if WebSocket is connected
	 */
	public isWebSocketConnected(): boolean {
		return this.isConnected && this.ws?.readyState === WebSocket.OPEN
	}

	/**
	 * Update subscription with new list of clob_token_ids
	 * Sends new subscription message without disconnecting
	 */
	public updateSubscription(clobTokenIds: ClobTokenId[]): void {
		if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
			console.error("❌ Cannot update subscription - WebSocket not connected")
			return
		}

		this.clobTokenIds = clobTokenIds
		console.info(`🔄 Updating subscription to ${clobTokenIds.length} assets...`)

		const subscription: MarketChannelSubscription = {
			type: "market",
			assets_ids: this.clobTokenIds
		}

		this.ws.send(JSON.stringify(subscription))
		console.info("✅ Subscription updated")
	}

	public getCurrentSubscription(): ClobTokenId[] {
		return [...this.clobTokenIds]
	}
}

const polymarketWebSocketClient = new PolymarketWebSocketClient()

export default polymarketWebSocketClient
