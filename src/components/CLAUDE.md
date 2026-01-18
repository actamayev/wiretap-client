# Components Directory

React components organized into a three-tier hierarchy: UI primitives, layout infrastructure, and feature-specific components. Total of 65+ components across 13 subdirectories plus 8 root-level utilities.

## Architecture Overview

The component structure follows a **feature-driven organization** with clear separation of concerns:

```
Tier 1: Foundation
├── ui/           (20 files) - Design system primitives
└── layouts/      (11 files) - Page structural wrappers

Tier 2: Cross-Cutting
├── sidebar/      (5 files) - Navigation
├── footer/       (1 file) - App footer
├── messages/     (1 file) - Notifications
├── support/      (1 file) - Help section
└── [Root level] (8 files) - Auth forms, charts, utilities

Tier 3: Feature-Specific
├── funds/        (6 files) - Portfolio management
├── events/       (4 files) - Event discovery
├── event/        (5 files) - Event detail/trading
├── profile/      (4 files) - User account settings
├── auth/         (4 files) - Authentication UI
├── contact/      (1 file) - Contact information
└── social-links/ (2 files) - Social integration
```

## Tier 1: Foundation Components

### ui/ - Design System (20 files)
Shadcn/ui-based primitive components providing the visual foundation.

**Form Components**:
- `button.tsx` - Buttons with variants
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `select.tsx` - Dropdown selection
- `form.tsx`, `field.tsx`, `label.tsx` - Form infrastructure

**Layout Components**:
- `card.tsx` - Content container
- `sidebar.tsx` - Sidebar navigation wrapper (21KB)
- `separator.tsx` - Visual divider
- `container.tsx` - Content wrapper with max-width

**Interactive Components**:
- `dialog.tsx` - Modal dialog
- `sheet.tsx` - Slide-out drawer
- `tabs.tsx` - Tabbed interface
- `dropdown-menu.tsx` - Dropdown menu
- `popover.tsx` - Floating popover

**Feedback Components**:
- `alert.tsx` - Alert message
- `spinner.tsx` - Loading indicator
- `skeleton.tsx` - Content placeholder
- `empty.tsx` - Empty state display
- `tooltip.tsx` - Hover tooltip
- `badge.tsx` - Labels/tags
- `avatar.tsx` - User/image avatars

**Usage**: Import from `@/components/ui` and use in higher-level components.

### layouts/ - Page Structure (11 files)
Wraps pages with consistent layouts, handles authentication, and provides top-level structure.

**Key Layout Components**:
- `layout-wrapper.tsx` - Top-level app wrapper
- `authenticated-layout.tsx` - Server component checking auth state
- `authenticated-layout-client.tsx` - Client component for authenticated pages
- `container-layout.tsx` - Content container with consistent spacing
- `sidebar-layout.tsx` - Layout with sidebar navigation
- `header-content.tsx` - Header section with user info
- `portfolio-stats.tsx` - Portfolio overview stats
- `search-bar.tsx` - Global search functionality
- `funds-dropdown.tsx` - Fund selector dropdown
- `feedback-dialog.tsx` - Feedback submission modal

**Pattern**: Layouts are composed together to build complete page structures:
```tsx
<LayoutWrapper>
  <AuthenticatedLayout>
    <SidebarLayout>
      <ContainerLayout>
        {/* Page content */}
      </ContainerLayout>
    </SidebarLayout>
  </AuthenticatedLayout>
</LayoutWrapper>
```

## Tier 2: Cross-Cutting Components

### sidebar/ - Navigation (5 files)
Provides primary app navigation.

- `primary-sidebar.tsx` - Main desktop navigation sidebar
- `sidebar-logo.tsx` - Branding logo
- `mapped-nav-data.tsx` - Navigation menu items from data
- `custom-sidebar-button.tsx` - Custom sidebar action button
- `profile-sidebar-button.tsx` - User profile button in sidebar

### Root-Level Utilities (8 files)

**Authentication**:
- `login-form.tsx` - Login form with email/password
- `signup-form.tsx` - Registration form
- `register-dialog.tsx` - Registration modal wrapper

**Visualization**:
- `price-history-chart-card.tsx` - Embedded price chart card
- `price-history-chart-page.tsx` - Full-page price chart

**General**:
- `custom-tooltip.tsx` - Enhanced tooltip component
- `compliance.tsx` - Legal/compliance text display
- `tailwind-indicator.tsx` - Dev utility for breakpoint debugging

### Other Utilities
- `footer/footer-social-section.tsx` - Social links in footer
- `messages/error-message.tsx` - Error notification display
- `support/support-section-container.tsx` - Support section wrapper
- `contact/contact-item-in-card.tsx` - Contact detail display
- `social-links/discord-link.tsx`, `x-link.tsx` - Social platform buttons

## Tier 3: Feature-Specific Components

### funds/ - Portfolio Management (6 files)

**funds-page/** - Fund Listing:
- `the-funds-page.tsx` - Main funds page with search/sort
- `single-fund-row.tsx` - Individual fund list item
- `create-fund-dialog.tsx` - Fund creation modal

**fund/** - Fund Detail:
- `single-fund-page.tsx` - Fund detail page wrapper
- `positions-tab.tsx` - Current positions display
- `transaction-history-tab.tsx` - Buy/sell order history

**Features**:
- Fund creation with initial balance
- Position tracking with P&L
- Transaction history
- Portfolio performance charts

### events/ - Event Discovery (4 files)

- `events.tsx` - Main events list (infinite scroll, search, filter)
- `single-event-card.tsx` - Single-market event card (large, interactive)
- `multi-market-event-card.tsx` - Multi-market event variant
- `event-card-skeleton.tsx` - Loading placeholder

**Features**:
- Paginated event listing
- Market discovery
- Real-time price updates (WebSocket)
- Responsive desktop/mobile layout

### event/ - Event Detail & Trading (5 files)

- `single-event-page.tsx` - Router/dispatcher for event pages
- `single-market-single-event-page.tsx` - Single-market trading (11KB)
- `multi-market-single-event-page.tsx` - Multi-market trading (16KB)
- `trade-card.tsx` - Buy/sell interface (8.5KB)
- `event-rules.tsx` - Event terms and rules

**Features**:
- Market outcome selection
- Real-time price display
- Buy/sell order execution
- Position summary
- Event information and rules

### profile/ - User Account (4 files)

- `the-profile-page.tsx` - Main profile page
- `profile-layout.tsx` - Profile page wrapper
- `change-password-section.tsx` - Password update form
- `profile-sidebar.tsx` - Profile navigation menu

**Features**:
- View account email
- Change password
- Account settings

### auth/ - Authentication (4 files)

- `or-component.tsx` - Visual divider (e.g., "OR sign in with Google")
- `password-input.tsx` - Reusable password field with visibility toggle
- `terms-and-privacy-agreement.tsx` - Checkbox for terms acceptance
- `google/google-sign-in.tsx` - Google OAuth button

**Features**:
- Email/password login
- Email/password registration
- Google OAuth integration
- Terms acceptance

## Component Patterns

### Pattern 1: Page Containers
```typescript
// Main page wrapper - handles routing and initialization
export default function SingleEventPage() {
  const [event, setEvent] = useState()

  useEffect(() => {
    retrieveSingleEvent(eventSlug)
  }, [eventSlug])

  return <SingleMarketSingleEventPage event={event} />
}
```

### Pattern 2: MobX Integration
Most components use `observer()` HOC for reactive state:
```typescript
import { observer } from "mobx-react"
import eventsClass from "@/classes/events-class"

const EventsList = observer(() => {
  return (
    <div>
      {eventsClass.events.map(event => (
        <EventCard key={event.eventSlug} event={event} />
      ))}
    </div>
  )
})
```

### Pattern 3: Compound Components
Form components often use compound pattern:
```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

### Pattern 4: Responsive Layout
Components often have separate desktop/mobile versions:
```typescript
// In single-event-card.tsx
const isMobile = useIsMobile()
return isMobile ? <MobileEventCard /> : <DesktopEventCard />
```

## State Management Integration

Components integrate with MobX classes:
- `eventsClass` - Event/market data
- `fundsClass` - Portfolio and fund data
- `authClass` - Authentication state
- `tradeClass` - Trading operations
- `personalInfoClass` - User profile
- `polymarketWebSocketClient` - Real-time price updates

Components use `observer()` to reactively render when state changes.

## Styling

All components use **Tailwind CSS** classes. Key conventions:
- Color scheme from design tokens
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first approach
- Custom colors defined in tailwind.config.js

## Adding New Components

1. **Determine Tier**:
   - Design primitive? → `/ui/`
   - Layout wrapper? → `/layouts/`
   - Feature-specific? → `/[feature]/`
   - Cross-cutting utility? → Root level

2. **Follow Naming**:
   - Page containers: `the-*-page.tsx`
   - Detail pages: `single-*-page.tsx`
   - Card/row components: `*-card.tsx`, `*-row.tsx`
   - Dialog/modal: `*-dialog.tsx`
   - Sections: `*-section.tsx`

3. **Use TypeScript**: All components are `.tsx` with full type annotations

4. **Integration Checklist**:
   - Import types from `@/types`
   - Use MobX `observer()` if reading state
   - Import utilities from `@/utils`
   - Use UI components from `/ui` for consistency
   - Add Tailwind classes for styling
   - Handle loading and error states

5. **Document**: Add inline comments for complex logic

## Key Files by Size
- `single-event-page.tsx` - ~11KB (complex conditional rendering)
- `multi-market-single-event-page.tsx` - ~16KB (large trading interface)
- `sidebar.tsx` - ~21KB (shadcn navigation base)
- `price-history-chart-card.tsx` - Medium (chart visualization)
- `the-funds-page.tsx` - Medium (list + search + sort)
