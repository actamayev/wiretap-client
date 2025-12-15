import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest): Promise<NextResponse> {
	try {
		// Get JWT from cookie
		const token = request.cookies.get("auth_token")?.value

		let userId: number | null = null

		// Token Extraction & Validation
		if (token) {
			try {
				const secret = new TextEncoder().encode(process.env.JWT_SECRET)
				const { payload } = await jwtVerify(token, secret) as { payload: JwtPayload }

				userId = payload.userId || null
			} catch (error) {
				console.error("JWT verification failed:", error)
				// Token is invalid, treat as unauthenticated
				userId = null
			}
		}

		// Always allow request through, regardless of auth status
		// Client-side components will handle showing login/signup forms for protected routes
		return handleNext(userId)
	} catch (error) {
		console.error("Middleware error:", error)
		// On any error, treat as unauthenticated but still allow through
		return handleNext(null)
	}
}

function handleNext(userId: number | null): NextResponse {
	const response = NextResponse.next()

	const authData = { userId }
	response.headers.set("x-auth-data", JSON.stringify(authData))

	return response
}

// Configure to run on all routes except Next.js internals
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, favicon.svg (favicon files)
		 * - apple-touch-icon.png, icon-*.png (PWA icons)
		 * - manifest.json, robots.txt, sitemap.xml (meta files)
		 * - Any file with an extension (images, fonts, etc.)
		 */
		// eslint-disable-next-line max-len
		"/((?!api|_next/static|_next/image|favicon\\.ico|favicon\\.svg|apple-touch-icon\\.png|icon-.*\\.png|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z]+$).*)",
	],
}
