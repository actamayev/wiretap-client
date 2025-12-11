"use client"

import Link from "next/link"
import { Button } from "../components/ui/button"

export default function Missing(): React.ReactNode {
	return (
		<div className="flex flex-col items-center gap-8 pt-16">
			<h1 className="text-2xl font-semibold">
				Page Not Found
			</h1>
			<Link href={"/"}>
				<Button className="text-2xl p-5">
					Events
				</Button>
			</Link>
		</div>
	)
}
