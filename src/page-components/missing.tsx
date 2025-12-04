"use client"

import Link from "next/link"
import { observer } from "mobx-react"
import authClass from "../classes/auth-class"
import { Button } from "../components/ui/button"
import { PageToNavigateAfterLogin } from "../utils/constants/page-constants"

function Missing(): React.ReactNode {
	const destination = authClass.isFinishedWithSignup ? PageToNavigateAfterLogin : "/"

	return (
		<div className="flex flex-col items-center gap-8 pt-16">
			<h1 className="text-2xl font-semibold">
				Page Not Found
			</h1>
			<Link href={destination}>
				<Button className="text-2xl p-5">
					{authClass.isFinishedWithSignup ? (
						<>
							RETURN TO EVENTS
						</>
					) : (
						<>
							RETURN HOME
						</>
					)}
				</Button>
			</Link>
		</div>
	)
}

export default observer(Missing)
