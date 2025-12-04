import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: [
					"/",
					"/contact",
					"/privacy",
					"/terms"
				],
				disallow: [
					"/events/",
					"/funds/",
					"/profile/",
					"/login",
					"/register",
					"/register-google"
				]
			}
		],
		sitemap: "https://wiretap.pro/sitemap.xml",
	}
}
