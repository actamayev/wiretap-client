import { AxiosResponse } from "axios"
import WiretapHttpClient from "../classes/wiretap-http-client"
import { BaseDataService } from "./base-data-service"

export default class AuthDataService extends BaseDataService {
	constructor(httpClient: WiretapHttpClient, pathHeader: EndpointHeaders) {
		super(httpClient, pathHeader)
	}

	async login(loginInformation: IncomingAuthRequest): Promise<AxiosResponse<LoginSuccess | NonSuccessResponse>> {
		return await this.httpClient.http.post<LoginSuccess | NonSuccessResponse>(
			this.buildUrl("/login"), { loginInformation }
		)
	}

	async logout(): Promise<AxiosResponse<SuccessResponse | ErrorResponse>> {
		return await this.httpClient.http.post<SuccessResponse | ErrorResponse>(
			this.buildUrl("/logout")
		)
	}

	async register(registerInformation: IncomingAuthRequest): Promise<AxiosResponse<AllMyFundsResponse | NonSuccessResponse>> {
		return await this.httpClient.http.post<AllMyFundsResponse | NonSuccessResponse>(
			this.buildUrl("/register"), { registerInformation }
		)
	}

	async googleLoginCallback(idToken: string): Promise<AxiosResponse<GoogleAuthSuccess | ErrorResponses>> {
		return await this.httpClient.http.post<GoogleAuthSuccess | ErrorResponses>(
			this.buildUrl("/google-auth/login-callback"), { idToken }
		)
	}
}
