# Misc Utils Directory

General-purpose utilities that don't fit into other categories.

## Files

### send-feedback.ts
Submits user feedback to the backend.

**Function**: `sendFeedback(feedback: string): Promise<boolean>`

**Behavior**:
1. Validates feedback is non-empty string
2. Sets loading state during submission
3. Calls API via `wiretapApiClient.miscDataService.sendFeedback()`
4. Returns success/failure boolean
5. Handles errors gracefully

**Usage**:
```typescript
const success = await sendFeedback(userMessage)
if (success) {
  showSuccessMessage("Thank you for your feedback!")
} else {
  showErrorMessage("Failed to send feedback")
}
```

**State Management**:
- Shows loading spinner during submission
- Clears error message on success
- Displays error message on failure

## Purpose

Provides a simple, reusable interface for feedback submission that:
- Validates input before sending
- Manages loading state
- Handles errors consistently
- Returns boolean for simple success/failure handling
