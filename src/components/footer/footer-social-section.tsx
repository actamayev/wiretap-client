"use client"

import XLink from "../social-links/x-link"
import InstagramLink from "../social-links/instagram-link"

export default function FooterSocialSection(): React.ReactNode {
	return (
		<div className="flex items-center space-x-3">
			<XLink />
			<InstagramLink />
		</div>
	)
}
