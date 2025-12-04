
"use client"

import { ComplianceParagraph } from "../components/compliance"
import ProfileLayout from "../components/profile/profile-layout"
import SupportSectionContainer from "../components/support/support-section-container"

export default function PrivacyPage(): React.ReactNode {
	return (
		<ProfileLayout>
			<SupportSectionContainer title="Privacy Policy">
				<div className="relative pt-16">
					<ComplianceParagraph>Please note that the Privacy Policy was last revised on December 4, 2025</ComplianceParagraph>
				</div>
			</SupportSectionContainer>
		</ProfileLayout>

	)
}
