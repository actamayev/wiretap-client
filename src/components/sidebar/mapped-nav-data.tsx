"use client"

import { observer } from "mobx-react"
import toUpper from "lodash-es/toUpper"
import { useCallback } from "react"
import { usePathname } from "next/navigation"
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "../../lib/utils"
import CustomSidebarButton from "./custom-sidebar-button"

const baseNavData: SidebarNavData[] = [
	{
		title: "Events",
		url: "/",
		textColor: "text-white"
	},
	{
		title: "Funds",
		url: "/funds",
		textColor: "text-white"
	}
]

function MappedNavData(): React.ReactNode {
	const pathname = usePathname()

	const isActive = useCallback((itemUrl: PageNames): boolean => {
		// Special case for Events: active on "/" or pages starting with "/event"
		if (itemUrl === "/") {
			return pathname === "/" || pathname.startsWith("/event")
		}
		// For other items, use startsWith logic
		return pathname.startsWith(itemUrl)
	}, [pathname])

	return (
		<SidebarGroup>
			<SidebarGroupContent className="px-1.5">
				<SidebarMenu>
					{baseNavData.map((item): React.ReactNode => {
						const active = isActive(item.url)

						return (
							<SidebarMenuItem key={item.title} className="flex justify-center mb-1">
								<CustomSidebarButton
									text={toUpper(item.title)}
									isActive={active}
									goTo={item.url}
									customStyles={cn(
										active && "border-selected-sidebar-button-border!"
									)}
								/>
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

export default observer(MappedNavData)
