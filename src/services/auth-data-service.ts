import { AxiosResponse } from "axios"
import WiretapHttpClient from "../classes/wiretap-http-client"
import { BaseDataService } from "./base-data-service"

export default class AuthDataService extends BaseDataService {
	constructor(httpClient: WiretapHttpClient, pathHeader: EndpointHeaders) {
		super(httpClient, pathHeader)
	}

	async login(loginInformation: IncomingLoginRequest): Promise<AxiosResponse<LoginSuccess | NonSuccessResponse>> {
		return await this.httpClient.http.post<LoginSuccess | NonSuccessResponse>(
			this.buildUrl("/login"), { loginInformation }
		)
	}

	async logout(): Promise<AxiosResponse<SuccessResponse | ErrorResponse>> {
		return await this.httpClient.http.post<SuccessResponse | ErrorResponse>(
			this.buildUrl("/logout")
		)
	}

	async register(registerInformation: IncomingRegisterRequest): Promise<AxiosResponse<SuccessResponse | NonSuccessResponse>> {
		return await this.httpClient.http.post<SuccessResponse | NonSuccessResponse>(
			this.buildUrl("/register"), { registerInformation }
		)
	}

	async registerGoogleInfo(googleInfo: NewGoogleInfoRequest): Promise<AxiosResponse<EmailUpdatesRequest | NonSuccessResponse>> {
		return await this.httpClient.http.post<EmailUpdatesRequest | NonSuccessResponse>(
			this.buildUrl("/register-google-info"), { ...googleInfo }
		)
	}

	async googleLoginCallback(idToken: string): Promise<AxiosResponse<GoogleAuthSuccess | ErrorResponses>> {
		return await this.httpClient.http.post<GoogleAuthSuccess | ErrorResponses>(
			this.buildUrl("/google-auth/login-callback"), { idToken }
		)
	}
}
