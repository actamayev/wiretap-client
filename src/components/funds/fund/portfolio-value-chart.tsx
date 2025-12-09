"use client"

import SimpleChart from "../../simple-chart"

interface PortfolioValueChartProps {
	fundUUID: FundsUUID
}

export default function PortfolioValueChart({ fundUUID }: PortfolioValueChartProps): React.ReactNode {
	return (
		<div className="w-full h-64 rounded-lg overflow-hidden bg-card p-4">
			<div className="w-full h-full rounded-[5px] overflow-hidden">
				<SimpleChart seed={fundUUID} />
			</div>
		</div>
	)
}
