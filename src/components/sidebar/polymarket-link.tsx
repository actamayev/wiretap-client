"use client"

import Image from "next/image"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

export default function PolymarketLink(): React.ReactNode {
	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex justify-start">
				<a
					href="https://polymarket.com?via=levi-sheridan"
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
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
