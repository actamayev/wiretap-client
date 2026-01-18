# Types Directory

Central location for global TypeScript type definitions and interfaces used throughout the application.

## Directory Structure

- **common/** - Shared types and API response/request types
  - `common.ts` - Core domain types (FundsUUID, EventId, MarketId, etc.) and main entity interfaces
  - `common-api.ts` - API request/response types and authentication types

- **events.ts** - Event and market-related types (SingleEvent, SingleMarket, OutcomePriceHistories)

- **polymarket.ts** - Polymarket WebSocket price update types (PriceUpdate)

- **polymarket-websocket.ts** - WebSocket connection and subscription types

- **funds.ts** - Fund-specific types

- **routes.ts** - Route and navigation types

- **utils.ts** - Utility types (EmailOrUnknown, LoginOrRegister, etc.)

## Key Patterns

### Branded Types
Uses TypeScript branded types for type safety:
- `FundsUUID`, `EventId`, `EventSlug`, `MarketId`, `OutcomeString`, `ClobTokenId`
- Prevents accidental mixing of similar string/number types

### Global Type Declaration
All types are declared in `declare global` blocks, making them available throughout the application without imports.

### Metadata vs Full Entities
- `*Metadata` interfaces contain only data that comes directly from the API
- Full entity interfaces (e.g., `SingleEvent`) extend metadata and add client-side state

## Adding New Types

1. Determine if the type is:
   - **API-related**: Add to `common/common-api.ts`
   - **Core domain**: Add to `common/common.ts`
   - **Feature-specific**: Create a new file (e.g., `notifications.ts`)

2. Use branded types for domain IDs to prevent type errors

3. Export via `declare global` to avoid import statements throughout app

4. Document complex types with comments explaining their purpose
