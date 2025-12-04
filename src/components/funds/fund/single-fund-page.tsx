import { observer } from "mobx-react"
import { useEffect, useMemo } from "react"
import isUndefined from "lodash-es/isUndefined"
import authClass from "../../../classes/auth-class"
import fundsClass from "../../../classes/funds-class"
import retrieveSingleFund from "../../../utils/funds/retrieve-single-fund"

function SingleFundPage({ fundUUID }: { fundUUID: FundsUUID}): React.ReactNode {
	useEffect((): void => {
		void retrieveSingleFund(fundUUID)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundUUID, authClass.isFinishedWithSignup])

	const isLoading = fundsClass.isRetrievingSingleFund(fundUUID)
	const fund = useMemo((): SingleFund | undefined => {
		return fundsClass.funds.get(fundUUID)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundUUID, fundsClass.funds.size])

	useEffect((): void => {
		document.title = `${fund?.fundName} | Wiretap`
	}, [fund?.fundName])

	if (isLoading) return <div>Loading...</div>

	if (isUndefined(fund)) return <div>Loading...</div>

	return (
		<div>
			{fund.fundName}
		</div>
	)
}

export default observer(SingleFundPage)
