const config = {
	darkMode: "class",
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			screens: {
				"xs": "475px",
				"wide": "1900px",
			},
			maxWidth: {
				"9xl": "1536px",
			},
			fontFamily: {
				dmSans: ["var(--font-dm-sans)", "sans-serif"],
			}
		}
	}
}

export default config
