# Auth Utils Directory

Authentication-related utilities for login, registration, logout, and form validation.

## Files

### auth-schemas.ts
Zod validation schemas for authentication forms.

**Exports**:
- `loginSchema` / `registerSchema` - Validate email and password
  - Email: 3-100 characters, valid email format
  - Password: 6-100 characters
  - User-friendly error messages for validation failures

### is-email-valid.ts
Simple email validation utility.

### confirm-login-fields.ts
Validates login form input before submission.

### confirm-register-fields.ts
Validates registration form input before submission.

### logout.ts
Orchestrates complete application logout workflow.

**Function**: `logout()`
- Calls API logout endpoint via `wiretapApiClient.authDataService.logout()`
- Clears state from all class stores:
  - `authClass.logout()` - Auth state
  - `personalInfoClass.logout()` - User info
  - `fundsClass.logout()` - Funds/portfolio
  - `eventsClass.logout()` - Events/markets
  - `tradeClass.logout()` - Trade state
- Disconnects WebSocket: `polymarketWebSocketClient.disconnect()`
- Gracefully handles API failures (clears local state anyway)

### submit/ (Subdirectory)
Form submission handlers that integrate validation, API calls, and state updates.

**login-submit.ts**
- Validates login credentials against schema
- Calls API login endpoint
- Updates `personalInfoClass` and `fundsClass` on success
- Sets `authClass.isAuthenticated = true`

**register-submit.ts**
- Validates registration credentials against schema
- Calls API register endpoint
- Populates initial funds on success
- Sets `authClass.isAuthenticated = true`

## Usage Pattern

1. User submits form
2. Submission handler validates against schema
3. If valid, calls API via data service
4. Updates state classes with response data
5. Returns result to component for UI feedback

## Key Dependencies

- `wiretapApiClient` - API calls
- `authClass`, `personalInfoClass`, `fundsClass`, `eventsClass`, `tradeClass` - State management
- `polymarketWebSocketClient` - Real-time price updates
- Zod - Schema validation
