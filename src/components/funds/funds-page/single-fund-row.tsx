import { observer } from "mobx-react"
import useTypedNavigate from "../../../hooks/navigate/use-typed-navigate"

function SingleFundRow({ fund }: { fund: SingleFund }): React.ReactNode {
	const navigate = useTypedNavigate()

	return (
		<div
			key={fund.fundUUID}
			onClick={(): void => navigate(`/funds/${fund.fundUUID}`)}
			className="flex flex-col gap-2 p-4 rounded-xl border border-swan">
			<h1 className="text-2xl font-bold">{fund.fundName}</h1>
			<p className="text-sm text-gray-500">
				{fund.startingAccountBalanceUsd}
			</p>
			<p className="text-sm text-gray-500">
				{fund.currentAccountBalanceUsd}
			</p>
		</div>
	)
}

export default observer(SingleFundRow)
