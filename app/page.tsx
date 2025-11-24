"use client"
import DarkVeil from "../src/components/DarkVeil"

export default function Home(): React.ReactNode {
	return (
		<div
			className="absolute inset-0 w-full h-dvh overflow-hidden"
			style={{
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: "100vw",
				height: "100dvh",
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
				<h1 className="text-4xl font-bold text-white">Wiretap</h1>
			</div>
		</div>
	)
}
