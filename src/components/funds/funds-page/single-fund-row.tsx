import { observer } from "mobx-react"
import useTypedNavigate from "../../../hooks/navigate/use-typed-navigate"

function SingleFundRow({ fund }: { fund: SingleFund }): React.ReactNode {
	const navigate = useTypedNavigate()

	return (
		<div
			key={fund.fundUUID}
			onClick={(): void => navigate(`/funds/${fund.fundUUID}`)}
			className="flex flex-col gap-2 p-4 rounded-xl border border-swan cursor-pointer"
		>
			<h1 className="text-2xl font-bold">{fund.fundName}</h1>
			<p className="text-sm text-gray-500">
				Starting balance: ${fund.startingAccountCashBalanceUsd}
			</p>
			<p className="text-sm text-gray-500">
				Current balance: ${fund.currentAccountCashBalanceUsd}
			</p>
		</div>
	)
}

export default observer(SingleFundRow)
