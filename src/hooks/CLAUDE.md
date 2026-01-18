# Hooks Directory

Custom React hooks that encapsulate reusable logic and state management patterns. Organized into feature-specific subdirectories.

## Hook Categories

### Navigation
**Directory**: `navigate/`

- **use-typed-navigate.ts** - Type-safe route navigation
  - Wraps Next.js `useRouter` with `PageNames` type constraint
  - Returns callback function for navigation
  - Prevents invalid route navigation at compile time

### Authentication
**Directory**: `google-auth/`

- **use-google-auth-callback.ts** - Google OAuth callback handler
  - Processes Google credential response
  - Calls backend authentication service
  - Updates auth, personal info, and funds state classes
  - Handles error cases and loading state
  - Returns authenticated user data or null

### Analytics
**Root Level**

- **use-initialize-google-analytics.ts** - Google Analytics setup
  - Initializes ReactGA4 once on component mount
  - Lazy-loads GA library for performance
  - Sends pageview events on route changes
  - Only runs in production environment
  - Returns void (setup hook, no return value)

### UI Utilities
**Directory**: `shadcn/`

- **use-mobile.ts** - Responsive design helper (from shadcn/ui)
  - Detects if viewport width is below mobile breakpoint (768px)
  - Returns boolean for conditional mobile UI rendering
  - Handles window resize events with MediaQueryList
  - Syncs state with actual viewport width

## Hook Patterns

### Pattern 1: State Management Hooks
Access to global state classes:
```typescript
// In components that use MobX state
const authState = useLocalObservable(() => authClass)
```
(Note: This pattern is used in components but not defined as a custom hook)

### Pattern 2: Navigation Hooks
```typescript
const navigate = useTypedNavigate()
navigate("/events")  // Type-safe, prevents invalid routes
```

### Pattern 3: Callback Hooks
```typescript
const handleGoogleAuth = useGoogleAuthCallback()
const result = await handleGoogleAuth(credentialResponse)
```

### Pattern 4: Setup Hooks
```typescript
useInitializeGoogleAnalytics()  // No return value, just side effects
```

### Pattern 5: Utility Hooks
```typescript
const isMobile = useIsMobile()
if (isMobile) {
  // Render mobile layout
}
```

## Usage in Components

Hooks are called at the top level of React components:

```typescript
"use client"

import useTypedNavigate from "@/hooks/navigate/use-typed-navigate"

export default function MyComponent() {
  const navigate = useTypedNavigate()

  return (
    <button onClick={() => navigate("/events")}>
      Go to Events
    </button>
  )
}
```

## Adding New Hooks

1. Create a new file in appropriate subdirectory (or root if general purpose)
2. Follow naming convention: `use<HookName>.ts`
3. Mark as client component with `"use client"` if needed
4. Use React hooks internally (useState, useEffect, useCallback, etc.)
5. Export default function starting with `use`
6. Provide TypeScript types for parameters and return value
7. Add documentation about the hook's purpose

### Hook Guidelines

- **Single Responsibility**: Each hook should do one thing well
- **No Side Effects in Render**: Use useEffect to manage side effects
- **Clean Up**: Always clean up listeners, intervals, etc. in useEffect cleanup
- **Memoization**: Use useCallback for functions returned from hooks to prevent re-renders
- **Dependencies**: List all dependencies in dependency arrays
