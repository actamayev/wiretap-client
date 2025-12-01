"use client"

import DarkVeil from "../components/DarkVeil"
import SubscribeForUpdatesForm from "../components/subscribe-for-updates-form"

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
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<div className="flex flex-col items-center mb-6">
					<h1 className="text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white">
						Wiretap
						<span
							className={
								"text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl font-normal leading-none relative inline-block"
							}
							style={{
								verticalAlign: "top",
								marginLeft: "0.25em",
								top: "1em",
							}}
						>
							BETA
						</span>
					</h1>
					<p className="text-white text-base lg:text-lg xl:text-lg mt-4">Paper trading for Polymarket</p>
				</div>
				<SubscribeForUpdatesForm />
			</div>
		</div>
	)
}
