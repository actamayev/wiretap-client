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
					"/funds/",
					"/profile/"
				]
			}
		],
		sitemap: "https://wiretap.pro/sitemap.xml",
	}
}
