"use client"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import CustomSidebarButton from "./custom-sidebar-button"

export default function ProfileSidebarButton(): React.ReactNode {
	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex justify-start">
				<CustomSidebarButton
					text="PROFILE"
					goTo="/profile"
				/>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
