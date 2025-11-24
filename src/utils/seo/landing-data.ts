/* eslint-disable max-len */
// Comprehensive Organization Schema
const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	"name": "Wiretap",
	"alternateName": [
		"Wiretap Trading Intelligence",
		"Wiretap Pro",
		"Wiretap Prediction Markets",
		"Wiretap Trading",
		"Wiretap News",
		"Wiretap Market Data"
	],
	"url": "https://wiretap.pro",
	"logo": {
		"@type": "ImageObject",
		"url": "https://wiretap.pro/logo512.png",
		"width": 512,
		"height": 512
	},

	"description": "Bloomberg Terminal for prediction markets. Real-time news aggregation and market intelligence platform designed to give prediction market traders an unfair advantage.",
	"slogan": "We give prediction market traders an unfair advantage",
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
		"category": "Trading Intelligence Software",
		"description": "Real-time news aggregation and market intelligence platform for prediction market traders"
	},

	// Target audience
	"audience": {
		"@type": "BusinessAudience",
		"audienceType": "Prediction Market Traders, Power Users, Professional Traders"
	},

	// Business categories
	"knowsAbout": [
		"Prediction Markets",
		"Trading Intelligence",
		"Real-time News Aggregation",
		"Market Data",
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
	"description": "Bloomberg Terminal for prediction markets. Real-time news aggregation and market intelligence.",
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
	"description": "Real-time news aggregation platform that aggregates thousands of sources to deliver breaking news to your feed within seconds. Personalized for your events and built for power users.",
	"applicationCategory": "Trading Software",
	"operatingSystem": "Web",
	"offers": {
		"@type": "Offer",
		"price": "0",
		"priceCurrency": "USD",
		"availability": "https://schema.org/InStock",
		"url": "https://wiretap.pro"
	},
	"featureList": [
		"Real-time news aggregation from thousands of sources",
		"Breaking news delivered within seconds",
		"Summarized headlines for faster decision-making",
		"Personalized event tracking",
		"Built for power users"
	],
	"screenshot": "https://wiretap.pro/screenshot.png"
}

// Service schema for Wiretap's service offering
const serviceSchema = {
	"@context": "https://schema.org",
	"@type": "Service",
	"name": "Wiretap Trading Intelligence",
	"description": "Ears to the ground, so you don't have to. We aggregate thousands of real-time sources to get you the information you need to make your best trades.",
	"provider": {
		"@type": "Organization",
		"name": "Wiretap"
	},
	"serviceType": "Trading Intelligence Service",
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
					"name": "Real-time News Aggregation",
					"description": "Aggregate thousands of real-time sources into your personalized feed"
				}
			},
			{
				"@type": "Offer",
				"itemOffered": {
					"@type": "Service",
					"name": "Event Tracking",
					"description": "Select events to track and get real-time news relating to your events"
				}
			},
			{
				"@type": "Offer",
				"itemOffered": {
					"@type": "Service",
					"name": "News Delivery Within Seconds",
					"description": "Breaking news to your feed within seconds"
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
				"text": "Wiretap is a Bloomberg Terminal for prediction markets. We aggregate thousands of real-time sources to deliver breaking news to your feed within seconds, giving prediction market traders an unfair advantage."
			}
		},
		{
			"@type": "Question",
			"name": "How fast is Wiretap's news delivery?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "We deliver breaking news to your feed within seconds. Our platform aggregates and summarizes live news from thousands of sources in real-time."
			}
		},
		{
			"@type": "Question",
			"name": "How does Wiretap work?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Wiretap works in two simple steps: 1) Select events to track, and 2) Get real-time news relating to your events. We aggregate thousands of sources, summarize the information, and deliver it to your personalized feed instantly."
			}
		},
		{
			"@type": "Question",
			"name": "What makes Wiretap different?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Wiretap aggregates data from thousands of sources, condenses live news into summarized headlines that help you make decisions faster, and does this all within seconds. It's personalized for your events and built for power users."
			}
		},
		{
			"@type": "Question",
			"name": "Who is Wiretap for?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Wiretap is built for power users and prediction market traders who need real-time information to make the best trades. If you need foresight into what happens right when it happens, Wiretap is for you."
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
