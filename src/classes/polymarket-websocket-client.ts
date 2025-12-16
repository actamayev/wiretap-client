"use client"

import { POLYMARKET_WS_URL, PING_INTERVAL_MS } from "../utils/constants/polymarket-websocket"
import eventsClass from "./events-class"
import fundsClass from "./funds-class"

class PolymarketWebSocketClient {
	private ws: WebSocket | null = null
	private pingInterval: ReturnType<typeof setInterval> | null = null
	private clobTokenIds: Set<ClobTokenId> = new Set()
	private isConnected = false

	constructor() {
	}

	/**
	 * Connect to Polymarket WebSocket and subscribe to markets
	 */
	public async connect(clobTokenIds: ClobTokenId[]): Promise<void> {
		if (this.isConnected) {
			console.warn("⚠️ WebSocket already connected, disconnecting first...")
			await this.disconnect()
		}

		this.clobTokenIds = new Set(clobTokenIds)
		console.info(`🔌 Connecting to Polymarket WebSocket with ${clobTokenIds.length} assets...`)

		return new Promise<void>((resolve, reject): void => {
			const ws = new WebSocket(POLYMARKET_WS_URL)
			this.ws = ws

			ws.onopen = (): void => {
				// Verify this is still the current WebSocket instance (not a stale connection)
				if (this.ws !== ws) {
					console.debug("🔌 Ignoring onopen from stale WebSocket connection (expected during reconnect)")
					return
				}

				console.info("✅ WebSocket connected")
				this.isConnected = true

				// Send subscription immediately - onopen only fires when WebSocket is OPEN
				if (ws.readyState === WebSocket.OPEN) {
					this.sendSubscription()
					this.startPingInterval()
					resolve()
				} else {
					console.error("❌ WebSocket not OPEN in onopen handler")
					reject(new Error("WebSocket not OPEN in onopen handler"))
				}
			}

			ws.onmessage = (event: MessageEvent): void => {
				// Only handle messages from the current WebSocket instance
				if (this.ws === ws) {
					this.handleMessage(event.data)
				}
			}

			ws.onerror = (error: Event): void => {
				// Only reject if this is the current WebSocket instance
				if (this.ws === ws) {
					console.error("❌ WebSocket error:", error)
					const errorObj = error instanceof Error ? error : new Error("WebSocket error occurred")
					reject(errorObj)
				}
			}

			ws.onclose = (event: CloseEvent): void => {
				// Only process close events from the current WebSocket instance
				if (this.ws === ws) {
					const reason = event.reason || "No reason provided"
					console.info(
						`🔌 WebSocket closed - Code: ${event.code}, Reason: ${reason}, WasClean: ${event.wasClean}`
					)
					this.isConnected = false
					this.stopPingInterval()
				}
			}
		})
	}

	/**
	 * Send subscription message to WebSocket
	 * Ensures WebSocket is OPEN before sending
	 */
	private sendSubscription(): void {
		// Double-check WebSocket state before sending
		if (!this.ws) {
			console.error("❌ Cannot send subscription - WebSocket is null")
			return
		}

		if (this.ws.readyState !== WebSocket.OPEN) {
			console.error(`❌ Cannot send subscription - WebSocket state: ${this.ws.readyState}`)
			return
		}

		try {
			// Subscribe to market channel
			const subscription: MarketChannelSubscription = {
				type: "market",
				assets_ids: Array.from(this.clobTokenIds)
			}

			this.ws.send(JSON.stringify(subscription))
			console.info(`📡 Subscribed to ${this.clobTokenIds.size} markets`)
		} catch (error) {
			console.error("❌ Error sending subscription:", error)
		}
	}

	/**
	 * Disconnect from WebSocket
	 */
	private disconnect(): Promise<void> {
		if (!this.ws) return Promise.resolve()

		console.info("🔌 Disconnecting WebSocket...")
		this.stopPingInterval()
		this.isConnected = false

		// Store reference to current WebSocket to avoid race conditions
		const wsToClose = this.ws
		this.ws = null // Clear reference immediately to prevent new operations

		return new Promise<void>((resolve): void => {
			if (wsToClose.readyState === WebSocket.OPEN || wsToClose.readyState === WebSocket.CONNECTING) {
				wsToClose.close()
				wsToClose.onclose = (): void => {
					resolve()
				}
			} else {
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
		if (messageStr === "PONG") {
			console.debug("📥 Received PONG")
			return
		}

		try {
			const parsed = JSON.parse(messageStr)

			// Handle array of messages (initial book snapshots)
			if (Array.isArray(parsed)) {
				console.debug(`📥 Received array of ${parsed.length} messages`)
				for (const message of parsed) {
					this.processMessage(message)
				}
				return
			}

			// Handle single message
			console.debug("📥 Received message:", parsed.event_type || "unknown")
			this.processMessage(parsed)
		} catch (error) {
			console.error("Failed to parse WebSocket message:", error, "Raw message:", messageStr)
		}
	}

	/**
	 * Process a single WebSocket message
	 */
	private processMessage(message: PolymarketMarketChannelMessage): void {
		switch (message.event_type) {
			case "price_change":
				this.handlePriceChange(message)
				break

			case "last_trade_price":
				//We don't process last trade price messages
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
		// Parse timestamp from WebSocket message (milliseconds as string)
		const timestamp = message.timestamp ? parseInt(message.timestamp, 10) : undefined

		for (const priceChange of message.price_changes) {
			const bestBid = parseFloat(priceChange.best_bid)
			const bestAsk = parseFloat(priceChange.best_ask)

			// Calculate midpoint price
			const midpointPrice = (!isNaN(bestBid) && !isNaN(bestAsk) && bestBid > 0 && bestAsk > 0)
				? (bestBid + bestAsk) / 2
				: null

			const priceUpdate: PriceUpdate = {
				clobTokenId: priceChange.asset_id,
				midpointPrice,
				timestamp
			}

			// Update events class with price update
			eventsClass.updateOutcomePrice(priceUpdate)
			// Update funds class with position price update
			fundsClass.updatePositionPrice(priceUpdate)
		}
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
	 * Add clob token IDs to the existing subscription
	 * Merges new tokens with current subscription (Set automatically prevents duplicates)
	 * Note: Polymarket's WebSocket requires reconnection to update subscriptions
	 */
	public async addToSubscription(clobTokenIds: ClobTokenId[]): Promise<void> {
		const initialSize = this.clobTokenIds.size
		// Add all new tokens to Set (duplicates are automatically ignored)
		for (const tokenId of clobTokenIds) {
			this.clobTokenIds.add(tokenId)
		}

		// Only reconnect if we have new tokens
		if (this.clobTokenIds.size === initialSize) return

		const addedCount = this.clobTokenIds.size - initialSize
		console.info(`➕ Adding ${addedCount} assets to subscription (total: ${this.clobTokenIds.size})...`)

		// Polymarket's WebSocket doesn't support subscription updates
		// We need to reconnect with the full list of tokens
		if (this.isConnected) {
			await this.disconnect()
		}

		// Connect (or reconnect) with updated token list
		await this.connect(Array.from(this.clobTokenIds))
		console.info("✅ Subscription updated with new tokens")
	}
}

const polymarketWebSocketClient = new PolymarketWebSocketClient()

export default polymarketWebSocketClient
