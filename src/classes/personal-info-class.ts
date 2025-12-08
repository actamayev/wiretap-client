"use client"

import { action, makeAutoObservable } from "mobx"

class PersonalInfoClass {
	public username: string | null = null
	public email: string | null = null
	public isGoogleUser = false

	public isRetrievingPersonalInfo = false
	public retrievedPersonalInfo = false

	constructor() {
		makeAutoObservable(this)
	}

	public setIsRetrievingPersonalDetails = action((newState: boolean): void => {
		this.isRetrievingPersonalInfo = newState
	})

	private setRetrievedPersonalInfo = action((newState: boolean): void => {
		this.retrievedPersonalInfo = newState
	})

	public setRetrievedPersonalData = action((retrievedData: BasicPersonalInfoResponse): void => {
		this.username = retrievedData.username
		this.email = retrievedData.email
		this.isGoogleUser = retrievedData.isGoogleUser
		this.setRetrievedPersonalInfo(true)
		this.setIsRetrievingPersonalDetails(false)
	})

	public setRegisteredValues = action((username: string, email: string): void => {
		this.username = username
		this.email = email
	})

	public setUsername = action((newUsername: string): void => {
		this.username = newUsername
	})

	public logout(): void {
		this.username = null
		this.email = null
		this.isGoogleUser = false
		this.setIsRetrievingPersonalDetails(false)
		this.setRetrievedPersonalInfo(false)
	}
}

const personalInfoClass = new PersonalInfoClass()

export default personalInfoClass
