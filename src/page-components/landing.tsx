"use client"

import DarkVeil from "../components/DarkVeil"

export default function Landing(): React.ReactNode {
	return (
		<div
			className="absolute overflow-hidden"
			style={{
				top: "calc(-1 * env(safe-area-inset-top, 0px))",
				left: "calc(-1 * env(safe-area-inset-left, 0px))",
				right: "calc(-1 * env(safe-area-inset-right, 0px))",
				bottom: "calc(-1 * env(safe-area-inset-bottom, 0px))",
				width: "calc(100vw + env(safe-area-inset-left, 0px) + env(safe-area-inset-right, 0px))",
				height: "calc(100dvh + env(safe-area-inset-top, 0px) + env(safe-area-inset-bottom, 0px))",
			}}
		>
			<DarkVeil
				speed={0.8}
				tintColor={[0, 65, 220]}
				noiseIntensity={0}
				scanlineIntensity={0}
				scanlineFrequency={5}
				warpAmount={0.5}
			/>
			<div className="absolute inset-0 flex items-center justify-center">
				<h1 className="text-8xl font-bold text-white">
					Wiretap
					<span
						className="text-2xl font-normal leading-none relative inline-block"
						style={{ verticalAlign: "top", marginLeft: "0.25em", top: "1em" }}
					>
						BETA
					</span>
				</h1>
			</div>
		</div>
	)
}
