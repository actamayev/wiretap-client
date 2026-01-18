# Services Directory

API data services that handle HTTP communication with the backend. Each service is responsible for a specific domain area and uses a common base class.

## Architecture

**Data Service Pattern**: Each service extends `BaseDataService` and provides typed methods for HTTP requests to a specific API endpoint group.

**HTTP Client**: All services use `WiretapHttpClient` (Axios wrapper) to make requests, managed by the service constructor.

**Type Safety**: All methods have full TypeScript typing for request/response data, preventing runtime errors.

## Base Service

- **base-data-service.ts** - Abstract base class for all data services
  - Provides `httpClient` and `pathHeader` (endpoint prefix like `/auth`, `/events`)
  - Implements `buildUrl()` utility for constructing endpoint URLs
  - Extended by all domain-specific services

## Data Services

### Authentication
- **auth-data-service.ts** - Authentication endpoints
  - `login()` - User login
  - `register()` - User registration
  - `logout()` - User logout
  - `googleLoginCallback()` - Google OAuth callback handler

### Events & Markets
- **events-data-service.ts** - Event and market data
  - `retrieveAllEvents(offset)` - Paginated event list
  - `retrieveSingleEvent(eventSlug)` - Detailed event data with markets

### Portfolio & Funds
- **funds-data-service.ts** - Fund management
  - `retrieveAllFunds()` - User's funds list
  - `retrieveDetailedFund(fundUUID)` - Fund with transactions
  - `retrievePortfolioHistoryByResolution(fundUUID, timeWindow)` - Historical portfolio values
  - `createFund(fundInformation)` - Create new fund
  - `setPrimaryFund(fundUUID)` - Mark fund as primary

### Trading
- **trade-data-service.ts** - Order execution
  - `buy(fundUUID, clobToken, valueOfSharesPurchasing)` - Buy shares
  - `sell(fundUUID, clobToken, numberOfSharesSelling)` - Sell shares

### User Profile
- **personal-info-data-service.ts** - User account settings
  - `retrievePersonalInfo()` - User email and account type
  - `changePassword(oldPassword, newPassword)` - Password update

### Miscellaneous
- **misc-data-service.ts** - General purpose endpoints
  - `sendFeedback(feedback)` - Submit user feedback

## Usage in Components

Services are accessed through the singleton API client:

```typescript
// Get all events
const response = await wiretapApiClient.eventsDataService.retrieveAllEvents()

// Buy shares
const response = await wiretapApiClient.tradeDataService.buy(fundUUID, clobToken, amount)
```

Responses are `AxiosResponse` objects with typed data. Handle both success and error responses:

```typescript
if (response.data.success) {
  // Success case
} else if ('error' in response.data) {
  // Error case
}
```

## Adding New Services

1. Create a new class extending `BaseDataService`
2. Call `super(httpClient, pathHeader)` in constructor
3. Add typed methods for each endpoint:
   ```typescript
   async methodName(params): Promise<AxiosResponse<SuccessType | ErrorType>> {
     return await this.httpClient.http.get/post/put/delete(
       this.buildUrl("/endpoint"),
       { requestData }
     )
   }
   ```
4. Export the service
5. Add to `WiretapApiClient` for central access

## Error Handling

All services return union types of success/error responses. Components should:
- Check for error properties before accessing success data
- Use type guards: `'error' in response.data`
- Handle network errors via Axios error handling
