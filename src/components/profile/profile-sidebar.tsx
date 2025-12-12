"use client"

import Link from "next/link"
import { useCallback } from "react"
import { LogOut } from "lucide-react"
import logout from "../../utils/auth/logout"
import useTypedNavigate from "../../hooks/navigate/use-typed-navigate"
import { Card, CardDescription, CardTitle } from "../ui/card"
import { Button } from "../ui/button"

interface SidebarSectionProps {
	title: string
	children: React.ReactNode
}

const SidebarSection = ({ title, children }: SidebarSectionProps): React.ReactNode => {
	return (
		<Card className="mb-8 pb-6 shadow-none bg-sidebar-blue border-2 border-white/30">
			<CardTitle className="text-wolf text-xl pl-10">
				{title}
			</CardTitle>
			<CardDescription className="space-y-4 text-eel">
				{children}
			</CardDescription>
		</Card>
	)
}

interface SidebarLinkProps {
	href: PageNames
	children: React.ReactNode
}

const SidebarLink = ({ href, children }: SidebarLinkProps): React.ReactNode => {
	return (
		<Link
			href={href}
			className="block text-lg hover:bg-off-sidebar-blue-hover rounded-lg py-1 px-6 mx-4 font-semibold text-eel"
		>
			{children}
		</Link>
	)
}

const BelowSidebarLink = ({ href, children }: SidebarLinkProps): React.ReactNode => {
	return (
		<Link
			href={href}
			className="block text-xs font-semibold text-button-text"
		>
			{children}
		</Link>
	)
}

export default function ProfileSidebar(): React.ReactNode {
	const navigate = useTypedNavigate()

	const completeLogout = useCallback(async (): Promise<void> => {
		await logout()
		navigate("/")
	}, [navigate])

	return (
		<div className="fixed right-0 top-0 w-[350px] mr-36 mt-6 rounded-lg h-full flex flex-col">
			<div>
				<SidebarSection title="Account">
					<SidebarLink href="/profile">Profile</SidebarLink>
				</SidebarSection>
				<SidebarSection title="Wiretap">
					<SidebarLink href="/contact">Contact Us</SidebarLink>
				</SidebarSection>
			</div>

			<Button
				onClick={completeLogout}
				className="w-full py-3 flex justify-center items-center font-medium rounded-lg h-10"
			>
				<LogOut className="mr-2 h-4 w-4" />
				LOG OUT
			</Button>
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-row justify-center space-x-4 mt-4">
					<BelowSidebarLink href="/privacy">PRIVACY</BelowSidebarLink>
					<BelowSidebarLink href="/terms">TERMS</BelowSidebarLink>
				</div>
			</div>
		</div>
	)
}
