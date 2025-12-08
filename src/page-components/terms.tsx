
"use client"

import { ComplianceParagraph, ComplianceSectionHeader } from "../components/compliance"
import ProfileLayout from "../components/profile/profile-layout"
import SupportSectionContainer from "../components/support/support-section-container"

// eslint-disable-next-line max-lines-per-function
export default function TermsPage(): React.ReactNode {
	return (
		<ProfileLayout>
			<SupportSectionContainer title="Terms and Conditions of Service">
				<div className="relative pt-16 pb-20">
					<ComplianceParagraph>Last Updated: December 8, 2024</ComplianceParagraph>

					<ComplianceSectionHeader>1. Acceptance of Terms</ComplianceSectionHeader>
					<ComplianceParagraph>
						By accessing or using Wiretap, you agree to these Terms of Service and our Privacy Policy. If you
						don't agree, don't use the platform. By using Wiretap, you represent that you are at least 18 years
						old and have the legal capacity to enter into this agreement.
					</ComplianceParagraph>
					<ComplianceParagraph>
						Wiretap is operated by Blue Dot Robots Inc., a Delaware corporation ("Wiretap," "we," "us," or
						"our").
					</ComplianceParagraph>

					<ComplianceSectionHeader>2. What Wiretap Is</ComplianceSectionHeader>
					<ComplianceParagraph>
						Wiretap is a paper trading simulation platform for prediction markets. It's for educational and
						entertainment purposes only. You're not trading with real money on Wiretap - you're practicing with
						simulated funds.
					</ComplianceParagraph>
					<ComplianceParagraph>
						Wiretap data is sourced from Polymarket's public API and other third-party prediction market
						platforms. We display this data for simulation purposes only.
					</ComplianceParagraph>

					<ComplianceSectionHeader>3. Not Financial Advice</ComplianceSectionHeader>
					<ComplianceParagraph>
						Nothing on Wiretap is financial advice. We don't provide investment recommendations, trading signals,
						guidance, or any form of financial, investment, legal, or tax advice. Any information, data, or
						performance metrics on the platform are for simulation and educational purposes only.
					</ComplianceParagraph>
					<ComplianceParagraph>
						You should consult with qualified financial, legal, and tax advisors before making any real trading
						decisions.
					</ComplianceParagraph>

					<ComplianceSectionHeader>4. Data Accuracy and Reliability</ComplianceSectionHeader>
					<ComplianceParagraph>
						Market data displayed on Wiretap, including prices, odds, volume, and other metrics, is sourced from
						third-party prediction market platforms. While we strive to present accurate information, you
						acknowledge and agree that:
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Data may be delayed, incomplete, or contain errors • We provide no warranty regarding the accuracy,
						completeness, or timeliness of any data • Data is provided "as is" for simulation and educational
						purposes only • You must independently verify any information before making real trading decisions
					</ComplianceParagraph>
					<ComplianceParagraph>
						Wiretap is a paper trading platform. If you choose to trade on Polymarket or any other platform with
						real money, you are solely responsible for verifying all market information independently. We have no
						duty to verify, correct, or update data displayed on our platform, and we are not liable for any
						trading decisions you make based on information seen on Wiretap.
					</ComplianceParagraph>
					<ComplianceParagraph>
						Technical Limitations: Our platform relies on third-party APIs and data feeds that may experience
						outages, delays, or errors. When we detect data quality issues, we may display warnings or temporarily
						disable certain features. However, you acknowledge that:
					</ComplianceParagraph>
					<ComplianceParagraph>
						• We cannot guarantee real-time data delivery • Data staleness warnings may not appear in all cases •
						Technical failures may occur without warning • You must independently verify all data before trading
					</ComplianceParagraph>
					<ComplianceParagraph>
						The presence of data quality warnings on our platform does not create any duty to provide such
						warnings in all circumstances, and the absence of warnings does not constitute a representation that
						data is accurate or current.
					</ComplianceParagraph>

					<ComplianceSectionHeader>5. Limitation of Liability</ComplianceSectionHeader>
					<ComplianceParagraph>
						TO THE MAXIMUM EXTENT PERMITTED BY LAW:
					</ComplianceParagraph>
					<ComplianceParagraph>
						Blue Dot Robots Inc. and its officers, directors, employees, and affiliates are not liable for any
						indirect, incidental, consequential, special, punitive, or exemplary damages arising from your use of
						Wiretap, including but not limited to:
					</ComplianceParagraph>
					<ComplianceParagraph>
						• Financial losses from real trading decisions made on any platform • Losses resulting from inaccurate,
						delayed, or incomplete data • Platform errors, bugs, downtime, or technical issues • Loss of profits,
						revenue, data, or business opportunities • Any other damages or losses of any kind
					</ComplianceParagraph>
					<ComplianceParagraph>
						Our total liability to you for any claims arising out of or related to these Terms or your use of
						Wiretap shall not exceed $100 or the amount you paid us in the past 12 months, whichever is greater.
					</ComplianceParagraph>
					<ComplianceParagraph>
						Some jurisdictions do not allow the limitation of certain damages. In such jurisdictions, our
						liability is limited to the maximum extent permitted by law.
					</ComplianceParagraph>

					<ComplianceSectionHeader>6. No Warranties</ComplianceSectionHeader>
					<ComplianceParagraph>
						TO THE MAXIMUM EXTENT PERMITTED BY LAW, Wiretap is provided "AS IS" and "AS AVAILABLE" without
						warranties of any kind, either express or implied, including but not limited to implied warranties of
						merchantability, fitness for a particular purpose, title, and non-infringement.
					</ComplianceParagraph>
					<ComplianceParagraph>
						We don't warrant that: • The platform will be error-free, secure, or uninterrupted • Defects will be
						corrected • The platform is free of viruses or harmful components • Results or data will be accurate or
						reliable
					</ComplianceParagraph>

					<ComplianceSectionHeader>7. Indemnification</ComplianceSectionHeader>
					<ComplianceParagraph>
						You agree to indemnify, defend, and hold harmless Blue Dot Robots Inc., its officers, directors,
						employees, and affiliates from any claims, losses, damages, liabilities, costs, and expenses
						(including reasonable attorneys' fees) arising from: • Your use of the platform • Your violation
						of these terms • Any real trading decisions you make • Your violation of any law or third-party
						rights
					</ComplianceParagraph>

					<ComplianceSectionHeader>8. Real Trading is Your Responsibility</ComplianceSectionHeader>
					<ComplianceParagraph>
						If you click through to Polymarket or any other trading platform and make real trades with real money,
						that is entirely your decision and your sole responsibility. We provide only a simulation tool. Any
						real trading activities you engage in are separate from Wiretap and at your own risk.
					</ComplianceParagraph>
					<ComplianceParagraph>
						You acknowledge that Wiretap has no control over, and no duty regarding, any real trading you conduct
						on third-party platforms.
					</ComplianceParagraph>

					<ComplianceSectionHeader>9. Affiliate Relationships</ComplianceSectionHeader>
					<ComplianceParagraph>
						Wiretap may earn referral commissions when you sign up for Polymarket or other platforms through our
						links. This affiliate relationship doesn't affect the simulation, our data, constitute an endorsement of
						any trading strategy, or create any fiduciary duty to you.
					</ComplianceParagraph>

					<ComplianceSectionHeader>10. Age Requirement and Eligibility</ComplianceSectionHeader>
					<ComplianceParagraph>
						You must be at least 18 years old to use Wiretap. By creating an account and using the platform, you
						represent and warrant that:
					</ComplianceParagraph>
					<ComplianceParagraph>
						• You are at least 18 years of age • You have the legal capacity to enter into this agreement • You
						will not allow anyone under 18 to access your account
					</ComplianceParagraph>
					<ComplianceParagraph>
						We do not knowingly collect information from anyone under 18. If we learn we have collected data from a
						minor, we will delete it promptly. If you believe someone under 18 is using the platform, contact us
						immediately at hello@wiretap.pro.
					</ComplianceParagraph>

					<ComplianceSectionHeader>11. Account Termination</ComplianceSectionHeader>
					<ComplianceParagraph>
						We reserve the right to suspend or terminate your account at any time, for any reason or no reason,
						including if you violate these terms, abuse the platform, or engage in fraudulent activity. You may
						delete your account at any time by contacting us.
					</ComplianceParagraph>

					<ComplianceSectionHeader>12. Dispute Resolution and Arbitration</ComplianceSectionHeader>
					<ComplianceParagraph>
						(a) Binding Arbitration: Any dispute, claim, or controversy arising out of or relating to these Terms
						or your use of Wiretap shall be resolved by binding arbitration administered by the American
						Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall be
						conducted in New York, New York.
					</ComplianceParagraph>
					<ComplianceParagraph>
						(b) Class Action Waiver: YOU AGREE THAT ANY ARBITRATION OR PROCEEDING SHALL BE LIMITED TO THE DISPUTE
						BETWEEN YOU AND WIRETAP INDIVIDUALLY. TO THE FULL EXTENT PERMITTED BY LAW, (i) no arbitration or
						proceeding shall be joined with any other; (ii) there is no right or authority for any dispute to be
						arbitrated on a class-action basis or to utilize class action procedures; and (iii) there is no right
						or authority for any dispute to be brought in a purported representative capacity on behalf of the
						general public or any other persons.
					</ComplianceParagraph>
					<ComplianceParagraph>
						(c) Waiver of Jury Trial: You waive any right to a jury trial in any proceeding arising out of or
						relating to these Terms.
					</ComplianceParagraph>
					<ComplianceParagraph>
						(d) Small Claims Court: Either party may bring a claim in small claims court as an alternative to
						arbitration.
					</ComplianceParagraph>

					<ComplianceSectionHeader>13. Governing Law and Venue</ComplianceSectionHeader>
					<ComplianceParagraph>
						These Terms are governed by the laws of the State of Delaware, without regard to conflict of law
						principles. Any litigation not subject to arbitration shall be brought exclusively in the state or
						federal courts located in Delaware, and you consent to personal jurisdiction in those courts.
					</ComplianceParagraph>

					<ComplianceSectionHeader>14. Changes to Terms</ComplianceSectionHeader>
					<ComplianceParagraph>
						We may modify these Terms at any time. The updated Terms will be posted at wiretap.pro/terms with a
						revised "Last Updated" date.
					</ComplianceParagraph>
					<ComplianceParagraph>
						For material changes (defined as changes that expand our rights, limit your rights, modify dispute
						resolution procedures, or change liability provisions), we will notify you via email or prominent notice
						on the platform at least 7 days before the changes take effect.
					</ComplianceParagraph>
					<ComplianceParagraph>
						Your continued use of Wiretap after changes take effect constitutes acceptance of the modified Terms.
						If you do not agree to the changes, you must stop using the platform and may delete your account.
					</ComplianceParagraph>
					<ComplianceParagraph>
						You are responsible for periodically reviewing the Terms at wiretap.pro/terms.
					</ComplianceParagraph>

					<ComplianceSectionHeader>15. Severability</ComplianceSectionHeader>
					<ComplianceParagraph>
						If any provision of these Terms is found to be unenforceable or invalid, that provision shall be
						limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full
						force and effect.
					</ComplianceParagraph>

					<ComplianceSectionHeader>16. Force Majeure</ComplianceSectionHeader>
					<ComplianceParagraph>
						We're not liable for any failure or delay in performance due to circumstances beyond our reasonable
						control, including acts of God, natural disasters, war, terrorism, riots, embargoes, acts of government
						authorities, network failures, or any other force majeure event.
					</ComplianceParagraph>

					<ComplianceSectionHeader>17. Electronic Communications</ComplianceSectionHeader>
					<ComplianceParagraph>
						By using Wiretap, you consent to receive electronic communications from us. You agree that all
						agreements, notices, and other communications we provide electronically satisfy any legal requirement
						that such communications be in writing.
					</ComplianceParagraph>

					<ComplianceSectionHeader>18. Entire Agreement</ComplianceSectionHeader>
					<ComplianceParagraph>
						These Terms, together with our Privacy Policy, constitute the entire agreement between you and Blue Dot
						Robots Inc. regarding your use of the platform and supersede all prior agreements.
					</ComplianceParagraph>

					<ComplianceSectionHeader>19. Contact</ComplianceSectionHeader>
					<ComplianceParagraph>
						Questions about these Terms? Email hello@wiretap.pro
					</ComplianceParagraph>
				</div>
			</SupportSectionContainer>
		</ProfileLayout>
	)
}
