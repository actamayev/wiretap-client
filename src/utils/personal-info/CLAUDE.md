# Personal Info Utils Directory

User profile and account settings utilities.

## Files

### retrieve-personal-info.ts
Fetches authenticated user's personal information.

**Function**: `retrievePersonalInfo(): Promise<void>`

**Behavior**:
1. Prevents duplicate requests with guard checks
2. Sets loading state: `personalInfoClass.isRetrievingPersonalInfo = true`
3. Calls API via `wiretapApiClient.personalInfoDataService.retrievePersonalInfo()`
4. Updates `personalInfoClass.retrievedPersonalData` with response
5. Handles errors gracefully

**Data Retrieved**:
- `email` - User's email address (or null if not set)
- `isGoogleUser` - Boolean indicating Google OAuth signup

**Usage**:
- Confirms user data after login/registration
- Displays user email in account settings
- Tracks authentication method

### change-password.ts
Updates user's account password.

**Function**: `changePassword(oldPassword: string, newPassword: string): Promise<boolean>`

**Behavior**:
1. Validates both passwords:
   - Old password: non-empty
   - New password: meets schema requirements (6-100 chars)
2. Validates passwords are different
3. Calls API via `wiretapApiClient.personalInfoDataService.changePassword()`
4. Returns success/failure boolean
5. Handles errors with user-friendly messages

**Validation**:
- Old and new passwords cannot be the same
- New password must meet security requirements
- Uses `auth-schemas.ts` for password validation

**Error Handling**:
- Returns error message on failure
- Handles validation errors from schema
- Displays API error responses to user

## Usage Pattern

Account settings flow:
```
1. User enters old and new password
2. changePassword() validates inputs
3. If valid, sends to API
4. Updates UI with success/error message
```

## State Dependencies

- `personalInfoClass` - User data storage
- Auth schemas from `utils/auth/auth-schemas.ts` - Password validation
