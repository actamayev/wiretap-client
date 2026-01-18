# Utils Directory

Application-wide utility functions organized by domain. Each subdirectory contains utilities for a specific feature area.

## Directory Structure

### [auth/](auth/) - Authentication Utilities
- Login/register form validation (Zod schemas)
- Logout orchestration
- Form submission handlers

### [constants/](constants/) - Configuration Constants
- Polymarket API and WebSocket configuration
- Timeframe definitions with labels and fidelity
- API endpoints and intervals

### [error-handling/](error-handling/) - Error Processing
- Centralized error message extraction from Axios responses
- Consistent error formatting for UI display

### [events/](events/) - Event/Market Data
- Fetch paginated event lists
- Retrieve detailed event data with all markets
- Fetch and cache price history for outcomes

### [funds/](funds/) - Portfolio Management
- Create new trading funds
- Retrieve fund list and detailed fund data
- Fetch historical portfolio performance
- Set primary fund

### [misc/](misc/) - General Utilities
- User feedback submission

### [personal-info/](personal-info/) - User Account
- Retrieve user profile information
- Update password

### [polymarket/](polymarket/) - Polymarket Integration
- Fetch outcome price history from CLOB API
- Support parameterized queries (timeframes, date ranges, fidelity)

### [seo/](seo/) - Search & Social Media
- Generate Next.js metadata for SEO
- Create OpenGraph and Twitter card tags
- Support structured data (JSON-LD)

### [trade/](trade/) - Trading Operations
- Execute share purchases in markets
- Execute share sales
- Validate trade parameters

## Common Patterns

### Pattern 1: State Updating Functions
Most utilities follow this pattern:
```typescript
async function fetchData(id: ID): Promise<void> {
  // Check guards (prevent duplicate requests)
  if (stateClass.isRetrieving.get(id)) return

  // Set loading
  stateClass.setIsRetrieving(id, true)

  try {
    // Call API
    const response = await api.call(id)

    // Update state
    stateClass.setState(response)
  } catch (error) {
    // Handle error
    handleError(error)
  } finally {
    // Clear loading
    stateClass.setIsRetrieving(id, false)
  }
}
```

### Pattern 2: Validation Then Submit
```typescript
async function submitData(data: FormData): Promise<Result> {
  // Validate
  const validated = schema.parse(data)

  // Call API
  const response = await api.submit(validated)

  // Update state
  stateClass.update(response)

  return result
}
```

### Pattern 3: Guard Checks
Most functions prevent duplicate/concurrent requests:
```typescript
if (stateClass.isLoading) return
if (stateClass.hasLoaded) return  // Don't fetch twice
```

## Usage Guidelines

### When to Create a Utility Function

Create a utility function when:
1. **Reusable Logic** - Logic used in multiple components
2. **Complex Operations** - Multi-step workflows (validate → API call → state update)
3. **State Coordination** - Updates multiple state classes
4. **API Orchestration** - Chains API calls together
5. **Business Logic** - Rules that apply across the app

### When to Keep Logic in Components

Keep in components when:
1. **Component-Specific** - Only used in one place
2. **Simple** - Just rendering UI based on state
3. **Event Handlers** - Simple onClick/onChange handlers

## State Classes Updated by Utils

- `authClass` - Auth state (login/logout)
- `personalInfoClass` - User profile
- `fundsClass` - Portfolio data
- `eventsClass` - Events and markets
- `tradeClass` - Trading state
- `polymarketWebSocketClient` - Real-time subscriptions

## Error Handling

All utilities handle errors consistently:
1. Catch API errors in try/catch
2. Extract user-friendly message via `setErrorAxiosResponse()`
3. Display error in UI (via toast, dialog, etc.)
4. Return null/false on failure for simple error handling
5. Never throw errors to components - always handle gracefully

## Adding New Utilities

1. Determine which subdirectory it belongs to
2. Create file with clear, descriptive name: `verb-noun.ts`
3. Add JSDoc comments explaining:
   - What the function does
   - What parameters it accepts
   - What state it updates
   - What errors it handles
4. Follow state update pattern above
5. Use guard checks to prevent duplicate requests
6. Add documentation to the subdirectory's CLAUDE.md
