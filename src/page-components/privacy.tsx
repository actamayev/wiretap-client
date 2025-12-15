
"use client"

import Link from "next/link"
import { ComplianceParagraph, ComplianceSectionHeader } from "../components/compliance"
import ProfileLayout from "../components/profile/profile-layout"
import SupportSectionContainer from "../components/support/support-section-container"

// eslint-disable-next-line max-lines-per-function
export default function PrivacyPage(): React.ReactNode {
	return (
		<ProfileLayout>
			<SupportSectionContainer title="Privacy Policy">
				<div className="relative pt-16 pb-20">
					<ComplianceParagraph>Last Updated: December 8, 2024</ComplianceParagraph>

					<ComplianceSectionHeader>1. Information We Collect</ComplianceSectionHeader>
					<ComplianceParagraph>
						(a) Account Information: Email address, password (encrypted)
					</ComplianceParagraph>
					<ComplianceParagraph>
						(b) Usage Data: Platform activity, simulated trades, paper portfolio data, strategy performance
					</ComplianceParagraph>
					<ComplianceParagraph>
						(c) Technical Information: IP address, browser type, device information, operating system, referring URLs
					</ComplianceParagraph>
					<ComplianceParagraph>
						(d) Analytics: How you use the platform, collected via third-party tools like Google Analytics
					</ComplianceParagraph>
					<ComplianceParagraph>
						(e) Communications: If you contact us, we collect the contents of your messages
					</ComplianceParagraph>

					<ComplianceSectionHeader>2. How We Use Your Information</ComplianceSectionHeader>
					<ComplianceParagraph>
						We use your information to:
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Operate, maintain, and improve the platform
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Track your paper trading activity and portfolio
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Send platform updates, notifications, and security alerts
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Respond to your requests and provide customer support
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Analyze usage patterns and optimize user experience
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Prevent fraud, abuse, and security threats
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Comply with legal obligations
					</ComplianceParagraph>

					<ComplianceSectionHeader>3. Information Sharing</ComplianceSectionHeader>
					<ComplianceParagraph>
						We don't sell your personal data. We may share information with:
					</ComplianceParagraph>
					<ComplianceParagraph>
						(a) Service Providers: Hosting providers (AWS, Vercel, etc.), analytics tools (Google Analytics),
						email services, payment processors (if applicable). These providers are contractually obligated to
						protect your data.
					</ComplianceParagraph>
					<ComplianceParagraph>
						(b) Legal Requirements: If required by law, court order, subpoena, or to protect our rights, property, or safety.
					</ComplianceParagraph>
					<ComplianceParagraph>
						(c) Business Transfers: If Wiretap is acquired or merged, your information may be transferred to the new entity.
					</ComplianceParagraph>
					<ComplianceParagraph>
						(d) With Your Consent: We may share information for other purposes with your explicit consent.
					</ComplianceParagraph>

					<ComplianceSectionHeader>4. Data Retention</ComplianceSectionHeader>
					<ComplianceParagraph>
						We retain your information for as long as your account is active or as needed to provide services. If
						you delete your account, we'll delete your personal information within 30 days, except:
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Data we're required to retain by law
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Aggregated, anonymized data used for analytics
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Backup copies (deleted within 90 days)
					</ComplianceParagraph>

					<ComplianceSectionHeader>5. Data Security</ComplianceSectionHeader>
					<ComplianceParagraph>
						We use reasonable security measures including encryption, secure servers, and access controls. However,
						no system is 100% secure. You use the platform at your own risk and are responsible for maintaining
						the confidentiality of your account credentials.
					</ComplianceParagraph>

					<ComplianceSectionHeader>6. Your Rights</ComplianceSectionHeader>
					<ComplianceParagraph>
						Depending on your location, you may have the following rights:
					</ComplianceParagraph>
					<ComplianceParagraph>
						(a) Access: Request a copy of the personal data we hold about you
					</ComplianceParagraph>
					<ComplianceParagraph>
						(b) Correction: Request correction of inaccurate information
					</ComplianceParagraph>
					<ComplianceParagraph>
						(c) Deletion: Request deletion of your account and data
					</ComplianceParagraph>
					<ComplianceParagraph>
						(d) Portability: Request a copy of your data in a portable format
					</ComplianceParagraph>
					<ComplianceParagraph>
						(e) Opt-Out: Unsubscribe from marketing emails (platform notifications may still be sent)
					</ComplianceParagraph>
					<ComplianceParagraph>
						(f) California Residents (CCPA): You have specific rights including the right to know what
						information we collect and the right to opt out of sale (we don't sell data)
					</ComplianceParagraph>
					<ComplianceParagraph>
						(g) EU/UK Residents (GDPR): You have additional rights including objection to processing and
						restriction of processing
					</ComplianceParagraph>
					<ComplianceParagraph>
						To exercise these rights, email{" "}
						<Link href="mailto:hello@wiretap.pro?subject=Privacy Rights Request" className="underline">
							hello@wiretap.pro
						</Link>
					</ComplianceParagraph>

					<ComplianceSectionHeader>7. Cookies and Tracking</ComplianceSectionHeader>
					<ComplianceParagraph>
						We use cookies, local storage, and similar technologies for:
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Authentication and account security
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Remembering your preferences
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Analytics and performance monitoring
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Understanding how users interact with the platform
					</ComplianceParagraph>
					<ComplianceParagraph>
						You can disable cookies in your browser settings, but some platform features may not work properly.
					</ComplianceParagraph>
					<ComplianceParagraph>
						Third-party cookies: We use Google Analytics which sets its own cookies. See Google's privacy policy for details.
					</ComplianceParagraph>

					<ComplianceSectionHeader>8. Third-Party Links</ComplianceSectionHeader>
					<ComplianceParagraph>
						Wiretap links to third-party websites like Polymarket. We're not responsible for their privacy
						practices. Review their privacy policies before providing them with information.
					</ComplianceParagraph>

					<ComplianceSectionHeader>9. International Data Transfers and Geographic Scope</ComplianceSectionHeader>
					<ComplianceParagraph>
						Wiretap is intended for users in the United States. If you access the platform from outside the US,
						you do so at your own risk and are responsible for compliance with local laws.
					</ComplianceParagraph>
					<ComplianceParagraph>
						Your information may be transferred to and processed in countries other than your own, including the
						United States. By using Wiretap, you consent to such transfers. We take reasonable steps to ensure
						your data is protected according to this Privacy Policy.
					</ComplianceParagraph>

					<ComplianceSectionHeader>10. Children's Privacy</ComplianceSectionHeader>
					<ComplianceParagraph>
						Wiretap is not intended for anyone under 18. We don't knowingly collect information from minors. If
						we learn we've collected data from someone under 18, we'll delete it promptly. If you believe we've
						collected information from a minor, contact us immediately at{" "}
						<Link href="mailto:hello@wiretap.pro?subject=Minor Data Removal Request" className="underline">
							hello@wiretap.pro
						</Link>
						.
					</ComplianceParagraph>

					<ComplianceSectionHeader>11. Do Not Track</ComplianceSectionHeader>
					<ComplianceParagraph>
						We don't currently respond to "Do Not Track" signals from browsers.
					</ComplianceParagraph>

					<ComplianceSectionHeader>12. Changes to Privacy Policy</ComplianceSectionHeader>
					<ComplianceParagraph>
						We may update this Privacy Policy at any time. Changes will be posted at wiretap.pro/privacy with a
						revised "Last Updated" date. Material changes will be notified via email or prominent platform
						notice. Your continued use after changes constitutes acceptance.
					</ComplianceParagraph>
					<ComplianceParagraph>
						You're responsible for reviewing this Privacy Policy periodically at wiretap.pro/privacy.
					</ComplianceParagraph>

					<ComplianceSectionHeader>13. Data Breach Notification</ComplianceSectionHeader>
					<ComplianceParagraph>
						In the event of a data breach that affects your personal information, we will notify affected users
						within 72 hours of discovering the breach, or as otherwise required by applicable law. We will also
						notify relevant authorities as required by law.
					</ComplianceParagraph>

					<ComplianceSectionHeader>14. Your California Privacy Rights</ComplianceSectionHeader>
					<ComplianceParagraph>
						California residents have additional rights under the California Consumer Privacy Act (CCPA):
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Right to know what personal information we collect, use, and share
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Right to delete personal information
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Right to opt-out of sale of personal information (we don't sell data)
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Right to non-discrimination for exercising these rights
					</ComplianceParagraph>

					<ComplianceSectionHeader>15. Contact</ComplianceSectionHeader>
					<ComplianceParagraph>
						Questions or requests regarding this Privacy Policy? Email{" "}
						<Link href="mailto:hello@wiretap.pro?subject=Privacy Policy Inquiry" className="underline">
							hello@wiretap.pro
						</Link>
					</ComplianceParagraph>
					<ComplianceParagraph>
						For GDPR/CCPA requests or data protection inquiries, please include "Privacy Request" in your subject
						line.
					</ComplianceParagraph>
				</div>
			</SupportSectionContainer>
		</ProfileLayout>

	)
}
