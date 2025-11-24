"use client"

import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export default function Dashboard(): React.ReactNode {
	return (
		<div className="w-full h-dvh relative overflow-hidden bg-gray-900">
			<h1 className="text-4xl font-bold text-white p-8">Dashboard</h1>
			<div className="w-full h-[calc(100dvh-8rem)] p-8">
				<ComposableMap
					projectionConfig={{
						scale: 147,
						center: [0, 20],
					}}
					className="w-full h-full"
				>
					<Geographies geography={geoUrl}>
						{({ geographies }: { geographies: Array<{ rsmKey: string; [key: string]: unknown }> }): React.ReactNode =>
							geographies.map((geo: { rsmKey: string; [key: string]: unknown }): React.ReactNode => (
								<Geography
									key={geo.rsmKey}
									geography={geo}
									fill="#334155"
									stroke="#64748b"
									strokeWidth={0.5}
									style={{
										default: { outline: "none" },
										hover: { outline: "none", fill: "#475569" },
										pressed: { outline: "none", fill: "#64748b" },
									}}
								/>
							))
						}
					</Geographies>
				</ComposableMap>
			</div>
		</div>
	)
}
