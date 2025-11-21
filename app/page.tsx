"use client"
import DarkVeil from "../src/components/DarkVeil"

export default function Home(): React.ReactNode {
	return (
		<div className="w-full h-screen relative">
			<DarkVeil
				speed={0.8}
				tintColor={[0, 65, 220]}
				noiseIntensity={0}
				scanlineIntensity={0}
				scanlineFrequency={5}
				warpAmount={0.5}
			/>
			<div className="absolute inset-0 flex items-center justify-center">
				<h1 className="text-4xl font-bold text-white">Hello World</h1>
			</div>
		</div>
	)
}
