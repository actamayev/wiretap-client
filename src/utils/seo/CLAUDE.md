# SEO Utils Directory

Search engine optimization and social media metadata generation utilities.

## Files

### create-metadata.ts
Generates Next.js metadata for SEO and social media cards.

**Function**: `createMetadata(options: MetadataOptions): Metadata`

**Parameters**:
- `title` (optional) - Page title, defaults to "Wiretap"
- `description` (optional) - Page description
- `ogImage` (optional) - OpenGraph image URL
- `noIndex` (optional) - Boolean to prevent search indexing
- `structuredData` (optional) - JSON-LD structured data object

**Returns**: Next.js `Metadata` object with:
- Standard meta tags (title, description, canonical URL)
- OpenGraph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Robots directives (noindex if specified)
- Structured data (if provided)

**Features**:
- Automatic canonical URL generation
- Mobile-optimized meta tags
- Social media card optimization
- Prevents duplicate content in search results (when noIndex=true)
- Supports custom structured data for rich snippets

**Usage Examples**:

Basic page:
```typescript
export const metadata = createMetadata({
  title: "Events",
  description: "Discover prediction markets"
})
```

With custom image:
```typescript
export const metadata = createMetadata({
  title: "About Wiretap",
  description: "Paper trading platform for prediction markets",
  ogImage: "/og-image.png"
})
```

Prevent indexing:
```typescript
export const metadata = createMetadata({
  title: "Contact",
  noIndex: true
})
```

### landing-data.ts
Content and configuration for the landing page.

Contains:
- Hero section copy
- Feature descriptions
- Call-to-action text
- Brand messaging
- Landing page layout configuration

## SEO Best Practices

1. **Every page should export metadata** from page-components
2. **Use descriptive titles** - Include main keyword, keep under 60 chars
3. **Write compelling descriptions** - Shows in search results, 160 chars ideal
4. **Set canonical URLs** - Prevents duplicate content penalties
5. **Use noIndex wisely** - Only for private/internal pages
6. **Add structured data** - Helps search engines understand content

## Integration with Next.js

In page components:
```typescript
import { createMetadata } from "@/utils/seo/create-metadata"

export const metadata = createMetadata({
  title: "My Page",
  description: "Page description"
})

export default function MyPage() {
  // Page component
}
```

## Social Media Cards

When pages are shared on Twitter/Facebook:
- OpenGraph tags control preview title and image
- Twitter card tags provide Twitter-specific formatting
- Both pull from the same metadata configuration
