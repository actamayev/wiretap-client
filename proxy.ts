import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

interface JwtPayload {
	userId: number
	isActive?: boolean
	iat?: number
	exp?: number
}

// Helper function to clear auth cookie
function clearAuthCookie(response: NextResponse): void {
	response.cookies.set("auth_token", "", {
		expires: new Date(0),
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax"
	})
}

// Helper function to create redirect response
function createRedirect(request: NextRequest, path: PageNames): NextResponse {
	return NextResponse.redirect(new URL(path, request.url))
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
	try {
		// Get JWT from cookie
		const token = request.cookies.get("auth_token")?.value

		let userId: number | null = null

		// Step 1: Token Extraction & Validation
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

		if (!userId) {
			const response = createRedirect(request, "/")
			clearAuthCookie(response)
			return response
		}
		return handleAuthenticated({ userId })
	} catch (error) {
		console.error("Middleware error:", error)
		// On any error, treat as unauthenticated
		return handleUnauthenticated()
	}
}

function handleUnauthenticated(): NextResponse {
	const response = NextResponse.next()

	const authData = { userId: null }
	response.headers.set("x-auth-data", JSON.stringify(authData))

	return response
}

function handleAuthenticated(auth: { userId: number }): NextResponse {
	const response = NextResponse.next()

	const authData = { userId: auth.userId }
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
