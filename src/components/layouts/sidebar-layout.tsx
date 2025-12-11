"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import PrimarySidebar from "../sidebar/primary-sidebar"

export default function SidebarLayout({ children } : { children: React.ReactNode }): React.ReactNode {
	return (
		<div className="h-screen overflow-hidden flex flex-col">
			<SidebarProvider>
				<PrimarySidebar />
				<SidebarInset className="overflow-y-auto min-h-0 bg-off-sidebar-blue">
					{children}
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
