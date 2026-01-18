# Error Handling Utils Directory

Centralized error handling and user-friendly error message extraction.

## Files

### set-error-axios-response.ts
Extracts and formats error messages from Axios responses.

**Function**: `setErrorAxiosResponse(response: AxiosResponse<any>): string`

Handles multiple error response formats:
1. `MessageResponse` - Message field: `{ message: "error text" }`
2. `ValidationErrorResponse` - Validation error field: `{ validationError: "error text" }`
3. `ErrorResponse` - Error field: `{ error: "error text" }`

Returns user-friendly message or fallback: `"Please try again"`

**Usage**:
```typescript
try {
  await api.call()
} catch (error: any) {
  const errorMessage = setErrorAxiosResponse(error.response)
  // Display errorMessage to user
}
```

## Purpose

Provides consistent error message extraction across all API error handling, preventing:
- Unhandled error property access
- Inconsistent error message formatting
- Exposing backend error structure to UI

## Common Error Patterns

Most API responses follow the pattern:
```typescript
type ApiResponse =
  | { success: "..." }
  | { message: "..." }
  | { validationError: "..." }
  | { error: "..." }
```

This utility safely extracts the error text from any format.
