import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createMetadata } from "../../../src/utils/seo/create-metadata"
import SingleFundPage from "../../../src/components/funds/fund/single-fund-page"
import AuthenticatedLayout from "../../../src/components/layouts/authenticated-layout"

interface SandboxProjectPageProps {
	params: Promise<{
		fundUUID: FundsUUID
	}>
}

export async function generateMetadata({ params }: SandboxProjectPageProps): Promise<Metadata> {
	const { fundUUID } = await params
	return createMetadata({
		title: "Fund",
		description: "View and manage your fund",
		path: `/funds/${fundUUID}`,
		keywords: ["funds", "management", "investments"]
	})
}

export default async function CustomSandboxProjectPage({ params }: SandboxProjectPageProps): Promise<React.ReactNode> {
	const { fundUUID } = await params

	// Basic validation - adjust regex based on your UUID format

	if (!fundUUID || !/^[a-fA-F0-9-]{36}$/.test(fundUUID)) {
		notFound()
	}

	return (
		<AuthenticatedLayout>
			<SingleFundPage fundUUID={fundUUID} />
		</AuthenticatedLayout>
	)
}
