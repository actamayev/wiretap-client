import { AxiosResponse } from "axios"
import WiretapHttpClient from "../classes/wiretap-http-client"
import { BaseDataService } from "./base-data-service"

export default class TradeDataService extends BaseDataService {
	constructor(httpClient: WiretapHttpClient, pathHeader: EndpointHeaders) {
		super(httpClient, pathHeader)
	}

	async buy(
		wiretapFundUuid: FundsUUID,
		clobToken: ClobTokenId,
		numberOfContractsPurchasing: number
	): Promise<AxiosResponse<SuccessBuyOrderResponse | NonSuccessResponse>> {
		return await this.httpClient.http.post<SuccessBuyOrderResponse | NonSuccessResponse>(
			this.buildUrl(`/buy/${wiretapFundUuid}`), { clobToken, numberOfContractsPurchasing }
		)
	}

	async sell(
		wiretapFundUuid: FundsUUID,
		clobToken: ClobTokenId,
		numberOfContractsSelling: number
	): Promise<AxiosResponse<SuccessSellOrderResponse | NonSuccessResponse>> {
		return await this.httpClient.http.post<SuccessSellOrderResponse | NonSuccessResponse>(
			this.buildUrl(`/sell/${wiretapFundUuid}`), { clobToken, numberOfContractsSelling }
		)
	}
}
