import { AxiosResponse } from "axios"
import WiretapHttpClient from "../classes/wiretap-http-client"
import { BaseDataService } from "./base-data-service"

export default class PersonalInfoDataService extends BaseDataService {
	constructor(httpClient: WiretapHttpClient, pathHeader: EndpointHeaders) {
		super(httpClient, pathHeader)
	}

	async retrievePersonalInfo(): Promise<AxiosResponse<BasicPersonalInfoResponse | ErrorResponse>> {
		return await this.httpClient.http.get<BasicPersonalInfoResponse | ErrorResponse>(
			this.buildUrl("/get-personal-info")
		)
	}

	async changePassword(oldPassword: string, newPassword: string): Promise<AxiosResponse<AllCommonResponses>> {
		return await this.httpClient.http.post<AllCommonResponses>(
			this.buildUrl("/change-password"), { oldPassword, newPassword }
		)
	}

	async updateUsername(username: string): Promise<AxiosResponse<AllCommonResponses>> {
		return await this.httpClient.http.post<AllCommonResponses>(
			this.buildUrl(`/update-username/${username}`)
		)
	}
}
