# Wiretap Client - Codebase Guide

A Next.js paper trading platform for prediction markets (Polymarket). Users can create portfolios, discover markets, and simulate trading with real market data.

## Quick Navigation

- **[/src/types/](src/types/CLAUDE.md)** - Global TypeScript types and interfaces
- **[/src/classes/](src/classes/CLAUDE.md)** - MobX state management classes (singletons)
- **[/src/services/](src/services/CLAUDE.md)** - API data services
- **[/src/hooks/](src/hooks/CLAUDE.md)** - Custom React hooks
- **[/src/utils/](src/utils/CLAUDE.md)** - Feature-organized utility functions
- **[/src/components/](src/components/CLAUDE.md)** - React components (3-tier architecture)
- **[/src/page-components/](src/page-components/CLAUDE.md)** - Top-level page components
- **[/app/](app/)** - Next.js App Router pages and layouts
- **[/public/](public/)** - Static assets (images, icons)

## Project Structure

```
wiretap-client/
├── app/                    # Next.js App Router (route definitions)
├── src/
│   ├── classes/            # MobX state management (singletons)
│   ├── components/         # React components (3-tier: UI → Layout → Features)
│   ├── hooks/              # Custom React hooks
│   ├── page-components/    # Top-level page components
│   ├── services/           # API data services
│   ├── types/              # Global TypeScript types
│   ├── utils/              # Feature-organized utility functions
│   ├── lib/                # Helper libraries and utilities
│   ├── icons/              # SVG icon components
│   ├── styles/             # Global styles
│   └── styles/             # CSS stylesheets
├── public/                 # Static assets
├── CLAUDE.md              # This file (global codebase guide)
└── package.json           # Dependencies and scripts
```

## Architecture Overview

### State Management (MobX)
Global application state is managed via MobX singleton classes:

```
authClass              → Authentication state, login/logout UI
personalInfoClass      → User profile and account data
fundsClass             → Portfolio/fund data and state
eventsClass            → Markets/events and selected outcomes
tradeClass             → Trading operations state
```

These classes are:
- Instantiated once and exported as singletons
- Used throughout components with `observer()` HOC
- Updated by utility functions that fetch data and call APIs

### Data Flow Architecture

```
Component
  ↓
Hook (optional)
  ↓
Utility Function (business logic + API call)
  ↓
Data Service (HTTP request)
  ↓
Backend API
  ↓
Response → State Class (MobX) → Component re-renders via observer()
```

### API Integration

All backend communication goes through **data services** in `/src/services/`:

1. **AuthDataService** - Login, register, Google OAuth
2. **EventsDataService** - Fetch events/markets
3. **FundsDataService** - Manage portfolios
4. **TradeDataService** - Buy/sell execution
5. **PersonalInfoDataService** - User profile
6. **MiscDataService** - Feedback submission

Services use `WiretapHttpClient` (Axios wrapper) for HTTP requests.

### Real-Time Updates (WebSocket)

**PolymarketWebSocketClient** provides real-time price updates:
- Connects to Polymarket WebSocket
- Subscribes to specific market outcomes (CLOB tokens)
- Updates price data in real-time
- Manages reconnection logic

Initialized by utility functions when fetching events/markets.

## Key Concepts

### Branded Types
Type-safe domain identifiers prevent mixing incompatible IDs:
```typescript
type EventId = string & { readonly __brand: unique symbol }
type MarketId = number & { readonly __brand: unique symbol }
type FundsUUID = UUID & { readonly __brand: unique symbol }
```

### Guard Checks
Utility functions prevent duplicate/concurrent API requests:
```typescript
if (eventsClass.isRetrievingAllEvents) return  // Already loading
if (eventsClass.hasRetrievedAllEvents) return  // Already loaded
```

### Metadata vs Full Entities
API provides lightweight metadata; client fetches additional data as needed:
- `SingleEventMetadata` - Basic event info (from API list)
- `SingleEvent` - Full event with markets and price history (fetched on demand)

### Responsive Design
Components support desktop and mobile with `useIsMobile()` hook:
```typescript
const isMobile = useIsMobile()
return isMobile ? <MobileLayout /> : <DesktopLayout />
```

## Common Development Tasks

### Adding a New Feature
1. **Design types** in `/src/types/` (define data structure)
2. **Create state class** in `/src/classes/` if needed (MobX state)
3. **Create data service** in `/src/services/` (API calls)
4. **Create utilities** in `/src/utils/[feature]/` (business logic)
5. **Create components** in `/src/components/[feature]/` (UI)
6. **Create hook** in `/src/hooks/` if reusable logic

### Fetching Data
1. Create utility function in `/src/utils/[feature]/`
2. Check guards to prevent duplicate requests
3. Set loading state in appropriate class
4. Call data service via API client
5. Update state class with response
6. Clear loading state in finally block

Example pattern:
```typescript
async function retrieveAllEvents() {
  if (eventsClass.isRetrievingAllEvents) return
  eventsClass.setIsRetrievingAllEvents(true)
  try {
    const response = await wiretapApiClient.eventsDataService.retrieveAllEvents()
    eventsClass.setEventsMetadata(response.data.events)
  } catch (error) {
    handleError(error)
  } finally {
    eventsClass.setIsRetrievingAllEvents(false)
  }
}
```

### Creating a New Page
1. Create page in `/app/[route]/page.tsx`
2. Create page component in `/src/page-components/[name].tsx`
3. Wrap with layouts from `/src/components/layouts/`
4. Import utilities and components as needed
5. Use `observer()` for MobX state if needed

### Adding Authentication
- Login form: `/src/components/login-form.tsx`
- Registration form: `/src/components/signup-form.tsx`
- Google OAuth: `/src/hooks/google-auth/use-google-auth-callback.ts`
- Logout: `/src/utils/auth/logout.ts`

## Code Organization Principles

### 1. Keep Components Focused
- Components render UI and handle user interaction
- Business logic belongs in utilities
- State management in classes

### 2. Organize by Feature
- Related code grouped in `/src/utils/[feature]/`
- Feature-specific components in `/src/components/[feature]/`
- Shared code in `/src/utils/misc/`, `/src/components/ui/`

### 3. Type Safety First
- All functions have parameter and return types
- Use branded types for domain IDs
- Global types in `/src/types/`

### 4. Error Handling
- Catch errors in utilities, not components
- Extract user-friendly messages via `setErrorAxiosResponse()`
- Return null/false for simple error handling
- Never throw to components

### 5. State Updates
- Only state classes update MobX state
- Utilities call state class methods
- Components read from state via `observer()`

## Performance Considerations

### Prevented with Guard Checks
- Duplicate API requests (check `isRetrieving` flag)
- Redundant data fetching (check `hasRetrieved` flag)
- Concurrent operations (guard flags)

### WebSocket for Real-Time
- Don't poll for price updates
- Use `polymarketWebSocketClient` for real-time data
- Subscribes only to needed tokens

### Pagination
- Events use offset-based pagination
- Prevents loading too much data at once
- `currentOffset` and `hasMoreEvents` flags

## Environment Variables

Key variables in `.env`:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API endpoint
- `NEXT_PUBLIC_MEASUREMENT_ID` - Google Analytics ID
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID

See `.env.sample` for complete list.

## Testing & Building

### Development
```bash
npm run dev          # Start dev server on http://localhost:3000
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Production
```bash
npm run build         # Build for production
npm run start         # Start production server
```

## Key Files by Purpose

### Authentication Flow
- `src/components/login-form.tsx` - Login UI
- `src/utils/auth/submit/login-submit.ts` - Login logic
- `src/hooks/google-auth/use-google-auth-callback.ts` - Google OAuth
- `src/utils/auth/logout.ts` - Logout orchestration

### Event Discovery
- `src/components/events/events.tsx` - Events list
- `src/utils/events/retrieve-all-events.ts` - Fetch events
- `src/classes/events-class.ts` - Event state

### Portfolio Management
- `src/components/funds/funds-page/the-funds-page.tsx` - Funds list
- `src/utils/funds/` - Fund operations
- `src/classes/funds-class.ts` - Fund state

### Trading
- `src/components/event/trade-card.tsx` - Trading UI
- `src/utils/trade/buy-shares.ts` - Buy logic
- `src/utils/trade/sell-shares.ts` - Sell logic
- `src/classes/trade-class.ts` - Trade state

### Real-Time Prices
- `src/classes/polymarket-websocket-client.ts` - WebSocket connection
- `src/utils/polymarket/retrieve-outcome-price-history.ts` - Historical data
- WebSocket updates flow to `SingleOutcome.priceHistory` in state

## Common Patterns

### 1. Data Fetching with Loading States
```typescript
async function fetchData() {
  if (class.isRetrieving) return           // Guard
  class.setIsRetrieving(true)              // Set loading
  try {
    const response = await api.call()      // Fetch
    class.setData(response.data)           // Update state
  } catch (error) {
    handleError(error)                     // Handle error
  } finally {
    class.setIsRetrieving(false)           // Clear loading
  }
}
```

### 2. Form Validation & Submission
```typescript
// Validate with schema
const validated = schema.parse(formData)

// Call API with validated data
const response = await apiClient.submit(validated)

// Update state on success
stateClass.update(response.data)
```

### 3. MobX State in Components
```typescript
const MyComponent = observer(() => {
  return (
    <div>
      {eventsClass.events.map(event => (
        <EventCard key={event.eventSlug} event={event} />
      ))}
    </div>
  )
})
```

### 4. Responsive Layout
```typescript
const MyComponent = () => {
  const isMobile = useIsMobile()
  return isMobile ? <MobileView /> : <DesktopView />
}
```

## Debugging Tips

### Check State
- Open browser DevTools → Console
- Access state classes: `window.authClass`, `window.eventsClass`, etc.
- Inspect state properties and loading flags

### Watch API Calls
- Network tab shows all HTTP requests
- Look for 401/403 errors (auth issues)
- Check response data structure matches types

### Monitor WebSocket
- Network tab → WS filter shows WebSocket connections
- Monitor message flow for real-time updates
- Check for reconnection attempts

### Check MobX Reactivity
- Use `observer()` HOC for state-dependent components
- Component won't re-render if not wrapped
- Check console for MobX warnings

## Contributing Guidelines

1. **Read CLAUDE.md for relevant directories** before modifying
2. **Follow existing patterns** for consistency
3. **Add types first** before implementation
4. **Use guard checks** to prevent duplicate requests
5. **Handle errors gracefully** in utilities
6. **Test responsive design** on mobile and desktop
7. **Keep components focused** (logic in utilities)

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MobX Documentation](https://mobx.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Polymarket API](https://polymarket.com)

## Project Statistics

- **Total Components**: 65+ across 13 subdirectories
- **State Classes**: 6 (auth, personal-info, funds, events, trade, websocket)
- **Data Services**: 7 (auth, events, funds, trade, personal-info, misc, base)
- **Utility Functions**: 20+ organized by feature
- **Custom Hooks**: 4 (navigation, auth, analytics, UI)
- **TypeScript Types**: 30+ global branded and interface types
