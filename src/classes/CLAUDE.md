# Classes Directory

MobX state management classes and API client orchestrators. Each class represents a distinct domain area in the application.

## Core Architecture

**Singleton Pattern**: Each class is instantiated once and exported as a singleton (e.g., `const authClass = new AuthClass()`), making it a global store.

**MobX Integration**: Most classes use `makeAutoObservable()` to automatically track state changes and make all methods actions.

## Classes Overview

### API Client Layer

- **wiretap-api-client-class.ts** - Main orchestrator that combines all data services
  - Initializes and exposes all data service instances
  - Provides unified access to auth, events, funds, trade, and personal info endpoints
  - Single instance: `wiretapApiClient`

- **wiretap-http-client.ts** - HTTP transport layer for all API requests

### Domain-Specific State Management

- **auth-class.ts** - Authentication and authorization state
  - Tracks login/register modal state, authentication status, pending navigation
  - Manages UI dialogs (feedback, register)
  - Does NOT handle JWT tokens (managed by server middleware)

- **events-class.ts** - Event and market data state
  - Stores events map keyed by EventSlug
  - Tracks loading states and pagination (offset, hasMoreEvents)
  - Manages selected markets and timeframes per event
  - Handles price history retrieval for outcomes

- **funds-class.ts** - Portfolio and fund data state
  - Stores funds map keyed by FundsUUID
  - Tracks which funds have detailed data loaded
  - Manages portfolio history retrieval by timeframe
  - Handles fund creation dialog state

- **trade-class.ts** - Trade order state (buy/sell)

- **personal-info-class.ts** - User profile information

### External Service Integration

- **polymarket-websocket-client.ts** - Polymarket WebSocket connection manager
  - Manages real-time price update subscriptions
  - Handles connection lifecycle (connect/disconnect/reconnect)
  - Implements ping/pong keep-alive mechanism
  - Updates event and fund classes with incoming price data

## State Update Patterns

### Loading States
Classes use paired properties to track data fetching:
```
isRetrievingAllEvents / hasRetrievedAllEvents
isRetrievingSingleEvent: Map<EventSlug, boolean>
```

### Pagination
Events uses offset-based pagination with `currentOffset` and `hasMoreEvents` flags.

### Nested Maps
Complex data is organized in Maps for efficient lookups:
- Events: `Map<EventSlug, SingleEvent>`
- Funds: `Map<FundsUUID, SingleUnfilledFund>`

## Usage in Components

Classes are typically accessed via hooks that return reactive observables:
```typescript
const authState = useLocalObservable(() => authClass)
const eventsState = useLocalObservable(() => eventsClass)
```

This ensures React components re-render when state changes.

## Adding New Classes

1. Use `makeAutoObservable()` in constructor for automatic MobX tracking
2. Wrap state changes with `@action` decorator or `action()` function for mutations
3. Create setter methods following the pattern `set<PropertyName>`
4. Export a singleton instance at the bottom of the file
5. Document loading states and data structure assumptions
