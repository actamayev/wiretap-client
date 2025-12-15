"use client"

import { action, makeAutoObservable } from "mobx"

class PersonalInfoClass {
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
		this.email = retrievedData.email
		this.isGoogleUser = retrievedData.isGoogleUser
		this.setRetrievedPersonalInfo(true)
		this.setIsRetrievingPersonalDetails(false)
	})

	public setEmail = action((email: string): void => {
		this.email = email
	})

	public logout(): void {
		this.email = null
		this.isGoogleUser = false
		this.setIsRetrievingPersonalDetails(false)
		this.setRetrievedPersonalInfo(false)
	}
}

const personalInfoClass = new PersonalInfoClass()

export default personalInfoClass
