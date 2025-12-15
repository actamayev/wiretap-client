import { getAuthState } from "@/lib/auth-server"
import LayoutWrapper from "./layout-wrapper"

interface LayoutOnlyWrapperProps {
	children: React.ReactNode
}

export default async function LayoutOnlyWrapper({ children }: LayoutOnlyWrapperProps): Promise<React.ReactElement> {
	const userId = await getAuthState()

	return (
		<LayoutWrapper userId={userId}>
			{children}
		</LayoutWrapper>
	)
}
