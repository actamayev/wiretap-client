"use client"

import { observer } from "mobx-react"
import { useMemo } from "react"
import WorkbenchLayout from "../../layouts/internal-container-layout"
import fundsClass from "../../../classes/funds-class"
import SingleFundRow from "./single-fund-row"
import { Button } from "../../ui/button"

function TheFundsPage(): React.ReactNode {
	const funds = useMemo((): SingleFund[] => {
		return Array.from(fundsClass.funds.values())
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fundsClass.funds.size])

	return (
		<WorkbenchLayout preventElasticScroll={true}>
			<div className="mb-4">
				<Button
					onClick={(): void => fundsClass.setIsCreateFundDialogOpen(true)}
					className="h-10 rounded-xl text-lg text-white bg-eel dark:bg-swan"
				>
					Create Fund
				</Button>
			</div>
			{funds.map((fund): React.ReactNode => (
				<SingleFundRow key={fund.fundUUID} fund={fund} />
			))}
		</WorkbenchLayout>
	)
}

export default observer(TheFundsPage)
