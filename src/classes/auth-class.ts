"use client"

import { action, makeAutoObservable } from "mobx"

class AuthClass {
	public showLoginOrRegister: LoginOrRegister = "Register"
	public isAuthenticating = false

	// Auth state is now managed by server middleware, but we keep these for UI state
	private _isAuthenticated = false
	public isLoggingOut = false  // NEW

	constructor() {
		makeAutoObservable(this)
	}

	// Getters for compatibility with existing code
	get isLoggedIn(): boolean {
		return this._isAuthenticated
	}

	public setIsAuthenticated = action((isAuthenticated: boolean): void => {
		this._isAuthenticated = isAuthenticated
	})

	public setAuthenticating = action((authenticating: boolean): void => {
		this.isAuthenticating = authenticating
	})

	public setShowLoginOrRegister = action((loginOrRegister: LoginOrRegister): void => {
		this.showLoginOrRegister = loginOrRegister
	})

	public setLoggingOut = action((state: boolean): void => {
		this.isLoggingOut = state
	})

	public logout = action((): void => {
		// Just reset local auth state - your logout util handles the rest
		this._isAuthenticated = false
		this.setShowLoginOrRegister("Register")
		this.setAuthenticating(false)
	})
}

const authClass = new AuthClass()

export default authClass
