"use client"

import Link from "next/link"
import Image from "next/image"
import {
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

export default function SidebarLogo(): React.ReactNode {
	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex justify-center">
				<Link
					href={"/"}
					className="flex items-center justify-center rounded-lg mt-1"
				>
					<div className="flex aspect-square items-center justify-center">
						<div className="flex">
							<Image
								src="/favicon-light.svg"
								alt="Logo"
								width={56}
								height={56}
								className="size-14"
								priority
							/>
						</div>
					</div>
				</Link>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
