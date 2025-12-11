"use client"

import { CustomDiscord } from "../../icons/custom-discord"

export default function DiscordLink(): React.ReactNode {
	return (
		<a
			href="https://discord.gg/vY5GhYUy"
			aria-label="Discord"
			className="text-question-text hover:text-gray-950 dark:hover:text-white duration-0 mt-1.5"
			target="_blank"
			rel="noopener noreferrer"
		>
			<CustomDiscord />
		</a>
	)
}
