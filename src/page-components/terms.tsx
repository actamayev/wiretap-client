
"use client"

import { ComplianceParagraph } from "../components/compliance"
import ProfileLayout from "../components/profile/profile-layout"
import SupportSectionContainer from "../components/support/support-section-container"

export default function TermsPage(): React.ReactNode {
	return (
		<ProfileLayout>
			<SupportSectionContainer title="Terms and Conditions of Service">
				<div className="relative pt-16">
					<ComplianceParagraph>
						Please note that these Terms and Conditions of Service were last revised on December 4th, 2025
					</ComplianceParagraph>
				</div>
			</SupportSectionContainer>
		</ProfileLayout>
	)
}
