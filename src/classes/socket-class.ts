"use client"

import { io, Socket } from "socket.io-client"
import { action, makeAutoObservable } from "mobx"
import { listenersMap } from "../utils/constants/listeners-map"

class SocketClass {
	private _socket: Socket | null = null
	public isConnected: boolean = false

	constructor() {
		makeAutoObservable(this)
	}

	public connect = action((): void => {
		if (this._socket !== null && this._socket.connected) return

		// Clean up any existing disconnected socket
		if (this._socket !== null) {
			this._socket.disconnect()
			this._socket = null
		}

		this._socket = io(process.env.NEXT_PUBLIC_BASE_URL as string, {
			path: "/socketio",
			transports: ["websocket"]
		})

		this.setupConnectionEvents()
		this.setupAllListeners()
	})

	private setupConnectionEvents = action((): void => {
		if (!this._socket) return

		this._socket.on("connect", (): void => {
			this.isConnected = true
		})

		this._socket.on("disconnect", (reason: Socket.DisconnectReason): void => {
			this.isConnected = false
			console.info(`🔌 Socket.IO disconnected: ${reason}`)
		})

		this._socket.on("connect_error", (error): void => {
			console.error("❌ Socket.IO connection error:", error.message)
		})

		this._socket.on("reconnect_attempt", (attempt): void => {
			console.info(`🔄 Reconnection attempt ${attempt}`)
		})

		this._socket.on("reconnect", (attempt): void => {
			console.info(`✅ Reconnected after ${attempt} attempts`)
		})
	})

	private setupTypedListener<E extends ServerSocketEvents>(
		event: E,
		handler: (payload: ServerSocketEventPayloadMap[E]) => void
	): void {
		if (!this._socket) return
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this._socket.on(event, handler as any)
	}

	private setupAllListeners = action((): void => {
		if (!this._socket) return
		Object.entries(listenersMap).forEach(([event, handler]): void => {
			try {
				this.setupTypedListener(
					event as ServerSocketEvents,
					handler as (payload: ServerSocketEventPayloadMap[ServerSocketEvents]) => void
				)
			} catch (error) {
				console.error(`Error in ${event} listener:`, error)
			}
		})
	})

	public disconnect = action((): void => {
		if (this._socket) {
			this._socket.disconnect()
			this._socket = null
		}
		this.isConnected = false
	})

	// Helper to check if currently connected
	get connected(): boolean {
		return this.isConnected && this._socket !== null && this._socket.connected
	}
}

const socketClass = new SocketClass()

export default socketClass
