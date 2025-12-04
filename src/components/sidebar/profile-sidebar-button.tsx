"use client"

import { observer } from "mobx-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import CustomSidebarButton from "./custom-sidebar-button"
import { CustomUserCircle } from "../../icons/custom-user-circle"

function ProfileSidebarButton(): React.ReactNode {
	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex justify-start">
				<CustomSidebarButton
					icon={(
						<Avatar className="w-full h-full">
							<AvatarFallback className="bg-standard-background text-question-text">
								<CustomUserCircle className="w-full h-full" />
							</AvatarFallback>
						</Avatar>
					)}
					text="PROFILE"
					goTo="/profile"
				/>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

export default observer(ProfileSidebarButton)
