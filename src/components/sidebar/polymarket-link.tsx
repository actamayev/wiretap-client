"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import CustomTooltip from "../custom-tooltip"

export default function PolymarketLink(): React.ReactNode {
	const pathname = usePathname()

	const polymarketUrl = useMemo((): string => {
		const baseUrl = "https://polymarket.com"
		const affiliateParam = "?via=levi-sheridan"

		// Check if we're on an event page: /events/{eventSlug}
		const eventMatch = pathname.match(/^\/event\/([^/]+)$/)
		if (eventMatch) {
			const eventSlug = eventMatch[1]
			return `${baseUrl}/event/${eventSlug}${affiliateParam}`
		}

		return `${baseUrl}${affiliateParam}`
	}, [pathname])

	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex justify-start">
				<CustomTooltip
					tooltipTrigger={
						<a
							href={polymarketUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-start gap-3 w-full p-2 hover:bg-off-sidebar-blue duration-0 rounded-xl"
						>
							<Image
								src="/polymarket-logo.png"
								alt="Polymarket"
								width={40}
								height={40}
								className="shrink-0 rounded-xs"
							/>
							<div className="flex flex-col justify-between text-xs text-sidebar-foreground h-10">
								<span>Ready to trade</span>
								<span>on Polymarket?</span>
							</div>
						</a>
					}
					tooltipContent="Affiliate link - we earn a commission"
					contentSide="right"
				/>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
