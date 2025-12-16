import { AxiosResponse } from "axios"
import WiretapHttpClient from "../classes/wiretap-http-client"
import { BaseDataService } from "./base-data-service"

export default class FundsDataService extends BaseDataService {
	constructor(httpClient: WiretapHttpClient, pathHeader: EndpointHeaders) {
		super(httpClient, pathHeader)
	}

	async retrieveAllFunds(): Promise<AxiosResponse<AllMyFundsResponse | ErrorResponse>> {
		return await this.httpClient.http.get<AllMyFundsResponse | ErrorResponse>(
			this.buildUrl("/all-my-funds")
		)
	}

	async retrieveDetailedFund(wiretapFundUUID: FundsUUID): Promise<AxiosResponse<DetailedSingleFundResponse | NonSuccessResponse>> {
		return await this.httpClient.http.get<DetailedSingleFundResponse | NonSuccessResponse>(
			this.buildUrl(`/detailed-fund/${wiretapFundUUID}`)
		)
	}

	async retrievePortfolioHistoryByResolution(
		wiretapFundUUID: FundsUUID,
		timeWindow: TimeWindow
	): Promise<AxiosResponse<SinglePortfolioSnapshotResponse | NonSuccessResponse>> {
		return await this.httpClient.http.post<SinglePortfolioSnapshotResponse | NonSuccessResponse>(
			this.buildUrl(`/portfolio-history-by-resolution/${wiretapFundUUID}`), { timeWindow }
		)
	}

	async createFund(fundInformation: IncomingCreateFundRequest): Promise<AxiosResponse<CreateFundResponse | ErrorResponse>> {
		return await this.httpClient.http.post<CreateFundResponse | ErrorResponse>(
			this.buildUrl("/create-fund"), { fundInformation }
		)
	}

	async setPrimaryFund(wiretapFundUUID: FundsUUID): Promise<AxiosResponse<AllCommonResponses>> {
		return await this.httpClient.http.post<AllCommonResponses>(
			this.buildUrl(`/set-primary-fund/${wiretapFundUUID}`)
		)
	}
}
