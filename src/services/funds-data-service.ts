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

	async retrieveSingleFund(wiretapFundUUID: FundsUUID): Promise<AxiosResponse<SingleFundResponse | ErrorResponse>> {
		return await this.httpClient.http.get<SingleFundResponse | ErrorResponse>(
			this.buildUrl(`/my-funds/${wiretapFundUUID}`)
		)
	}

	async createFund(fundInformation: IncomingCreateFundRequest): Promise<AxiosResponse<CreateFundResponse | ErrorResponse>> {
		return await this.httpClient.http.post<CreateFundResponse | ErrorResponse>(
			this.buildUrl("/create-fund"), { fundInformation }
		)
	}

	async renameFund(wiretapFundUUID: FundsUUID, newFundName: string): Promise<AxiosResponse<AllCommonResponses>> {
		return await this.httpClient.http.post<AllCommonResponses>(
			this.buildUrl(`/rename-fund/${wiretapFundUUID}`), { newFundName }
		)
	}

	async retrieveFundPositions(wiretapFundUUID: FundsUUID): Promise<AxiosResponse<PositionsResponse | ErrorResponse>> {
		return await this.httpClient.http.get<PositionsResponse | ErrorResponse>(
			this.buildUrl(`/all-current-positions/${wiretapFundUUID}`)
		)
	}

	async retrieveFundTransactions(wiretapFundUUID: FundsUUID): Promise<AxiosResponse<TransactionResponse | ErrorResponse>> {
		return await this.httpClient.http.get<TransactionResponse | ErrorResponse>(
			this.buildUrl(`/all-fund-transactions/${wiretapFundUUID}`)
		)
	}
}
