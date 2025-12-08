"use client"

import WiretapHttpClient from "./wiretap-http-client"
import AuthDataService from "../services/auth-data-service"
import MiscDataService from "../services/misc-data-service"
import PersonalInfoDataService from "../services/personal-info-data-service"
import FundsDataService from "../services/funds-data-service"
import EventsDataService from "../services/events-data-service"

class WiretapApiClient {
	public httpClient: WiretapHttpClient = new WiretapHttpClient()
	public authDataService: AuthDataService = new AuthDataService(this.httpClient, "/auth")
	public miscDataService: MiscDataService = new MiscDataService(this.httpClient, "/misc")
	public eventsDataService: EventsDataService = new EventsDataService(this.httpClient, "/events")
	public personalInfoDataService: PersonalInfoDataService = new PersonalInfoDataService(this.httpClient, "/personal-info")
	public fundsDataService: FundsDataService = new FundsDataService(this.httpClient, "/funds")

	constructor() {
	}

	// No logout method needed: cookies are cleared by server endpoint
}

const wiretapApiClient = new WiretapApiClient()

export default wiretapApiClient
