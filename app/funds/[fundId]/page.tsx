import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createMetadata } from "../../../src/utils/seo/create-metadata"
import SingleFundPage from "../../../src/components/funds/fund/single-fund-page"
import AuthenticatedLayout from "../../../src/components/layouts/authenticated-layout"

interface SandboxProjectPageProps {
	params: Promise<{
		fundId: FundsUUID
	}>
}

export async function generateMetadata({ params }: SandboxProjectPageProps): Promise<Metadata> {
	const { fundId } = await params
	return createMetadata({
		title: "Fund",
		description: "View and manage your fund",
		path: `/funds/${fundId}`,
		keywords: ["funds", "management", "investments"]
	})
}

export default async function CustomSandboxProjectPage({ params }: SandboxProjectPageProps): Promise<React.ReactNode> {
	const { fundId } = await params

	// Basic validation - adjust regex based on your UUID format

	if (!fundId || !/^[a-fA-F0-9-]{36}$/.test(fundId)) {
		notFound()
	}

	return (
		<AuthenticatedLayout>
			<SingleFundPage fundId={fundId} />
		</AuthenticatedLayout>
	)
}
