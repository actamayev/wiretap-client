"use client"

import MiscDataService from "../services/misc-data-service"
import WiretapHttpClient from "./wiretap-http-client"

class WiretapApiClient {
	public httpClient: WiretapHttpClient = new WiretapHttpClient()
	public miscDataService: MiscDataService = new MiscDataService(this.httpClient, "/misc")

	constructor() {
	}

	// No logout method needed: cookies are cleared by server endpoint
}

const wiretapApiClient = new WiretapApiClient()

export default wiretapApiClient
