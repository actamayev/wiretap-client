"use client"

import { Briefcase, Map } from "lucide-react"
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
		url: "/events",
		icon: Map,
		textColor: "text-white"
	},
	{
		title: "Funds",
		url: "/funds",
		icon: Briefcase,
		textColor: "text-white"
	},
]

function MappedNavData(): React.ReactNode {
	const pathname = usePathname()

	const isActive = useCallback((itemUrl: PageNames): boolean => {
		return pathname.startsWith(itemUrl)
	}, [pathname])

	return (
		<SidebarGroup>
			<SidebarGroupContent className="px-1.5">
				<SidebarMenu>
					{baseNavData.map((item): React.ReactNode => {
						const active = isActive(item.url)

						// Create styled icon elements
						const iconElement = (
							<div className={cn(
								"w-full h-full flex items-center justify-center relative",
								item.textColor
							)}>
								<item.icon className="h-[35px] w-[35px]" />
							</div>
						)

						return (
							<SidebarMenuItem key={item.title} className="flex justify-center mb-1">
								<CustomSidebarButton
									icon={iconElement}
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
