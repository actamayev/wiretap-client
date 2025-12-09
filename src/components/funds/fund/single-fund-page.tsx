"use client"
import { observer } from "mobx-react"
import { useEffect, useMemo } from "react"
import isUndefined from "lodash-es/isUndefined"
import authClass from "../../../classes/auth-class"
import fundsClass from "../../../classes/funds-class"
import retrieveSingleFund from "../../../utils/funds/retrieve-single-fund"
import InternalContainerLayout from "../../layouts/internal-container-layout"

function SingleFundPage({ fundId }: { fundId: FundsUUID}): React.ReactNode {
	useEffect((): void => {
		void retrieveSingleFund(fundId)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundId, authClass.isFinishedWithSignup])

	const isLoading = fundsClass.isRetrievingSingleFund(fundId)
	const fund = useMemo((): SingleFund | undefined => {
		return fundsClass.funds.get(fundId)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundId, fundsClass.funds.size])

	useEffect((): void => {
		document.title = `${fund?.fundName} | Wiretap`
	}, [fund?.fundName])

	if (isLoading) return (
		<InternalContainerLayout>
			<div>Loading...</div>
		</InternalContainerLayout>
	)

	if (isUndefined(fund)) return (
		<InternalContainerLayout>
			<div>Loading...</div>
		</InternalContainerLayout>
	)

	return (
		<InternalContainerLayout>
			<div>
				<h1 className="text-2xl font-bold">{fund.fundName}</h1>
				<p className="text-sm text-gray-500">
					Starting balance: ${fund.startingAccountCashBalanceUsd}
				</p>
				<p className="text-sm text-gray-500">
					Current balance: ${fund.currentAccountCashBalanceUsd}
				</p>
			</div>
		</InternalContainerLayout>
	)
}

export default observer(SingleFundPage)
