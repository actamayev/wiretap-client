"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import SidebarLogo from "./sidebar-logo"
import MappedNavData from "./mapped-nav-data"
import ProfileSidebarButton from "./profile-sidebar-button"
import PolymarketLink from "./polymarket-link"

export default function PrimarySidebar(): React.ReactNode {
	return (
		<Sidebar
			collapsible="icon"
			className="hidden md:flex border-r-2! border-sidebar-blue"
		>
			<SidebarHeader>
				<SidebarLogo />
			</SidebarHeader>

			<SidebarContent style={{ paddingBlock: "12px" }}>
				<MappedNavData />
			</SidebarContent>

			<SidebarFooter>
				<ProfileSidebarButton />
				<PolymarketLink />
			</SidebarFooter>
		</Sidebar>
	)
}
