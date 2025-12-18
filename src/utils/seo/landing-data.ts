/* eslint-disable max-len */
// Comprehensive Organization Schema
const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	"name": "Wiretap",
	"alternateName": [
		"Wiretap Paper Trading",
		"Wiretap Pro",
		"Wiretap Prediction Markets",
		"Wiretap Trading Simulator"
	],
	"url": "https://wiretap.pro",
	"logo": {
		"@type": "ImageObject",
		"url": "https://wiretap.pro/logo512.png",
		"width": 512,
		"height": 512
	},

	"description": "Paper trading platform for prediction markets including Polymarket and Kalshi. Improve your trading strategy without risking real money. Paper trade until you're not a joke.",
	"slogan": "Paper trade on Wiretap until you're not a joke",
	"foundingDate": "2025",

	// Contact information
	"email": "hello@wiretap.pro",
	"contactPoint": {
		"@type": "ContactPoint",
		"contactType": "Customer Support",
		"email": "hello@wiretap.pro",
		"url": "https://wiretap.pro/contact",
		"availableLanguage": ["English"]
	},

	// Social media profiles (update with actual URLs when available)
	"sameAs": [
		"https://x.com/wiretap_pro",
		"https://www.linkedin.com/company/wiretap_pro"
	],

	// What you offer
	"offers": {
		"@type": "Offer",
		"category": "Trading Software",
		"description": "Paper trading platform for prediction markets including Polymarket and Kalshi where traders improve their strategies without risking real money"
	},

	// Target audience
	"audience": {
		"@type": "BusinessAudience",
		"audienceType": "Prediction Market Traders, Polymarket Traders, Kalshi Traders, Aspiring Traders, Trading Enthusiasts"
	},

	// Business categories
	"knowsAbout": [
		"Polymarket",
		"Kalshi",
		"Paper Trading",
		"Prediction Markets",
		"Trading Simulation",
		"Financial Technology",
		"Trading Tools"
	],

	// Geographic area served
	"areaServed": {
		"@type": "Country",
		"name": "United States"
	}
}

// WebSite schema for search box and site navigation
const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	"name": "Wiretap",
	"url": "https://wiretap.pro",
	"description": "Paper trading platform for prediction markets including Polymarket and Kalshi. Improve your trading strategy without risking real money.",
	"publisher": {
		"@type": "Organization",
		"name": "Wiretap"
	},
	// Enables Google to show a search box in search results
	"potentialAction": {
		"@type": "SearchAction",
		"target": {
			"@type": "EntryPoint",
			"urlTemplate": "https://wiretap.pro/search?q={search_term_string}"
		},
		"query-input": "required name=search_term_string"
	}
}

// SoftwareApplication schema for Wiretap platform
const softwareApplicationSchema = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	"name": "Wiretap",
	"description": "Paper trading platform for prediction markets including Polymarket and Kalshi where you can practice and improve your trading strategy without risking real money. Get better before you go broke.",
	"applicationCategory": "Trading Software",
	"operatingSystem": "Web",
	"offers": {
		"@type": "Offer",
		"price": "0",
		"priceCurrency": "USD",
		"availability": "https://schema.org/PreOrder",
		"url": "https://wiretap.pro"
	},
	"featureList": [
		"Paper trading on prediction markets (Polymarket, Kalshi)",
		"Risk-free trading practice",
		"Improve your trading strategy",
		"Track your performance"
	],
	"screenshot": "https://wiretap.pro/screenshot.png"
}

// Service schema for Wiretap's service offering
const serviceSchema = {
	"@context": "https://schema.org",
	"@type": "Service",
	"name": "Wiretap Paper Trading",
	"description": "Paper trade on prediction markets including Polymarket and Kalshi until you're not a joke. Improve your trading strategy without risking real money.",
	"provider": {
		"@type": "Organization",
		"name": "Wiretap"
	},
	"serviceType": "Trading Service",
	"areaServed": {
		"@type": "Country",
		"name": "United States"
	},
	"hasOfferCatalog": {
		"@type": "OfferCatalog",
		"name": "Wiretap Services",
		"itemListElement": [
			{
				"@type": "Offer",
				"itemOffered": {
					"@type": "Service",
					"name": "Paper Trading on Prediction Markets",
					"description": "Practice trading on prediction markets including Polymarket and Kalshi without risking real money"
				}
			},
			{
				"@type": "Offer",
				"itemOffered": {
					"@type": "Service",
					"name": "Performance Tracking",
					"description": "Track your paper trading performance and see what works"
				}
			}
		]
	}
}

// Complete FAQ Schema
const faqSchema = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	"mainEntity": [
		{
			"@type": "Question",
			"name": "What is Wiretap?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Wiretap is a paper trading platform for prediction markets including Polymarket and Kalshi. Paper trade until you're not a joke. Improve your trading strategy without risking real money."
			}
		},
		{
			"@type": "Question",
			"name": "When does Wiretap beta open?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Wiretap beta opens December 10th. Sign up at wiretap.pro to get access to paper trading on prediction markets including Polymarket and Kalshi."
			}
		},
		{
			"@type": "Question",
			"name": "How does Wiretap work?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Wiretap lets you paper trade on prediction markets including Polymarket and Kalshi without risking real money. Practice your trading strategy and improve before you go broke with real trades."
			}
		},
		{
			"@type": "Question",
			"name": "What makes Wiretap different?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Wiretap is built specifically for prediction market paper trading including Polymarket and Kalshi. If your prediction market strategy is hope and vibes, that's why you're broke. Wiretap helps you improve your trading before risking real money."
			}
		},
		{
			"@type": "Question",
			"name": "Who is Wiretap for?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Wiretap is for anyone trading on prediction markets including Polymarket and Kalshi who wants to improve. If you're tired of losing money because your strategy is hope and vibes, Wiretap helps you practice until you're not a joke."
			}
		},
		{
			"@type": "Question",
			"name": "How can I contact Wiretap?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "If you have any questions or feedback, please contact us at hello@wiretap.pro. We're here to help."
			}
		}
	]
}

// Then add to your existing structuredData @graph:
export const structuredData = {
	"@context": "https://schema.org",
	"@graph": [
		organizationSchema,
		websiteSchema,
		softwareApplicationSchema,
		serviceSchema,
		faqSchema
	]
}
