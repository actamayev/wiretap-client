"use client"

import { observer } from "mobx-react"
import { useEffect, useMemo } from "react"
import WorkbenchLayout from "../../layouts/internal-container-layout"
import retrieveAllFunds from "../../../utils/funds/retrieve-all-funds"
import authClass from "../../../classes/auth-class"
import CreateFundsDialog from "./create-funds-dialog"
import fundsClass from "../../../classes/funds-class"
import SingleFundRow from "./single-fund-row"

function TheFundsPage(): React.ReactNode {
	useEffect((): void => {
		void retrieveAllFunds()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authClass.isFinishedWithSignup])

	const funds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

	return (
		<WorkbenchLayout preventElasticScroll={true}>
			{funds.map((fund): React.ReactNode => (
				<SingleFundRow key={fund.fundUUID} fund={fund} />
			))}
			<CreateFundsDialog />
		</WorkbenchLayout>
	)
}

export default observer(TheFundsPage)
