"use client"
import { ReactNode } from "react"
import useInitializeGoogleAnalytics from "../src/hooks/use-initialize-google-analytics"

export default function Providers({ children }: { children: ReactNode }): React.ReactNode {
	useInitializeGoogleAnalytics()

	return <>{children}</>
}
