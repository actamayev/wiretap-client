"use client"

import { observer } from "mobx-react"
import ProfileLayout from "./profile-layout"
import ChangePasswordSection from "./change-password-section"
import personalInfoClass from "../../classes/personal-info-class"

function ProfilePage(): React.ReactNode {
	return (
		<ProfileLayout>
			<div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 mt-5 max-w-full">
				<div className="font-medium text-2xl md:text-3xl text-eel mb-6 md:mb-10">
					Profile
				</div>

				<div className="mb-6">
					<div className="text-base md:text-lg font-medium text-eel mb-2 block">
						Email
					</div>
					<div className="text-base md:text-lg font-medium text-wolf wrap-break-word">
						{personalInfoClass.email || "No email set"}
					</div>
				</div>

				<ChangePasswordSection />
			</div>
		</ProfileLayout>
	)
}

export default observer(ProfilePage)
