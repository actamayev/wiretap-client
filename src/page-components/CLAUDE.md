# Page Components Directory

Top-level page components that are directly mounted by Next.js App Router. These components represent full pages in the application.

## Purpose

Each file in this directory is a page component that:
- Gets rendered by Next.js when the matching route is accessed
- Wraps page-specific content with layout components
- Handles top-level page logic (e.g., scroll restoration)
- Delegates to smaller, reusable components for actual UI

## Page Components

- **contact.tsx** - Contact page (`/contact`)
  - Displays contact information and social links
  - Wrapped in ProfileLayout and SupportSectionContainer
  - Resets scroll position on mount

- **privacy.tsx** - Privacy Policy page (`/privacy`)
  - Full privacy policy text for legal compliance
  - Uses ComplianceSectionHeader and ComplianceParagraph components for consistent formatting
  - Wrapped in ProfileLayout and SupportSectionContainer

- **terms.tsx** - Terms of Service page (`/terms`)
  - Full terms of service text for legal compliance
  - Similar structure and layout as privacy.tsx

- **missing.tsx** - 404 Not Found page
  - Fallback for undefined routes
  - Provides navigation back to main events page

## Architecture Pattern

These components follow a consistent pattern:

```tsx
"use client"  // Client component for interactivity

export default function PageName(): React.ReactNode {
  // Optional: page-level effects
  useEffect((): void => window.scrollTo(0, 0), [])

  return (
    <ProfileLayout>
      <SupportSectionContainer>
        {/* Page content */}
      </SupportSectionContainer>
    </ProfileLayout>
  )
}
```

## Related Directories

- [components/](../components/) - Reusable UI components used within page components
- [page-components/](.) - These components (mounted by Next.js routes in `/app`)

## Adding New Pages

1. Create a new `.tsx` file with the page name
2. Mark as `"use client"` for client-side interactivity
3. Wrap content with appropriate layout components (ProfileLayout, etc.)
4. Export default function with `React.ReactNode` return type
5. Add route file in `/app` directory if needed
