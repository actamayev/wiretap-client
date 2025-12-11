"use client"


import { forwardRef } from "react"
import type { LucideIcon, LucideProps } from "lucide-react"

export const CustomDiscord: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
	({ color = "currentColor", size = 24, className = "", ...props }, ref) => (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill={color}
			width={size}
			height={size}
			className={className}
			{...props}
		>
			<path
				d="M15.379 0a14.024 14.024 0 0 0 -0.637 1.288 18.553 18.553 0 0 0 -5.495 0A12.887 12.887 0 0 0 8.611 0a20.012 20.012 0 0 0 -4.954 1.527C0.527 6.165 -0.32 10.683 0.1 15.139a19.898 19.898 0 0 0 6.074 3.049 14.592 14.592 0 0 0 1.302 -2.097c-0.708 -0.263 -1.393 -0.593 -2.049 -0.976 0.172 -0.125 0.34 -0.254 0.503 -0.378a14.262 14.262 0 0 0 12.143 0c0.163 0.134 0.33 0.263 0.503 0.378a13.076 13.076 0 0 1 -2.053 0.981A14.592 14.592 0 0 0 17.824 18.193a19.898 19.898 0 0 0 6.074 -3.044c0.498 -5.169 -0.852 -9.649 -3.566 -13.617A19.709 19.709 0 0 0 15.383 0.009zM8.012 12.396c-1.182 0 -2.163 -1.072 -2.163 -2.398s0.943 -2.403 2.159 -2.403 2.183 1.082 2.163 2.403c-0.019 1.321 -0.952 2.398 -2.158 2.398m7.974 0c-1.187 0 -2.159 -1.072 -2.159 -2.398s0.943 -2.403 2.158 -2.403S18.164 8.678 18.145 9.999c-0.019 1.321 -0.952 2.398 -2.158 2.398"
				fill={color}
			/>
		</svg>
	)
)

CustomDiscord.displayName = "CustomDiscord"

