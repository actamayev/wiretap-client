# Funds Utils Directory

Portfolio and fund management utilities including creation, retrieval, and performance tracking.

## Files

### retrieve-all-funds.ts
Fetches user's funds/portfolios.

**Function**: `retrieveAllFunds(): Promise<void>`

**Behavior**:
1. Prevents concurrent requests with guard checks
2. Sets loading state: `fundsClass.isRetrievingAllFunds = true`
3. Calls API to fetch all user funds
4. Updates `fundsClass.funds` map keyed by FundsUUID
5. Handles errors gracefully

### retrieve-detailed-fund.ts
Fetches detailed fund data including transactions and portfolio history.

**Function**: `retrieveDetailedFund(fundUUID: FundsUUID): Promise<void>`

**Behavior**:
1. Prevents duplicate retrieval with guard checks
2. Sets loading state: `fundsClass.retrievingDetailedFund.set(fundUUID, true)`
3. Calls API for fund details (transactions, positions)
4. Updates fund in `fundsClass.funds` map
5. Stores both purchase orders and sale orders

### retrieve-portfolio-price-history.ts
Fetches historical portfolio value data for performance tracking.

**Function**: `retrievePortfolioHistory(fundUUID: FundsUUID, timeWindow: TimeWindow): Promise<void>`

**Behavior**:
1. Prevents duplicate requests per timeframe with guard checks
2. Sets loading state: `fundsClass.setIsRetrievingPortfolioHistory(fundUUID, timeWindow, true)`
3. Calls API with timeWindow parameter ("1H", "1D", "1W", "1M", "MAX")
4. Updates portfolio history in fund state
5. Used for portfolio value charts

**TimeWindows**: `"1H"`, `"1D"`, `"1W"`, `"1M"`, `"MAX"`

### create-fund.ts
Creates a new trading fund/portfolio.

**Function**: `createFund(fundName: string, startingBalance: number): Promise<FundsUUID | null>`

**Behavior**:
1. Validates input (non-empty name, positive balance)
2. Calls API to create fund
3. Initializes fund with:
   - Empty positions array
   - Starting cash balance
   - Empty transaction history
   - Empty portfolio history
4. Adds fund to `fundsClass.funds` map
5. Returns fund UUID on success, null on failure

**State Updates**:
- `fundsClass.funds` - Adds new fund
- `fundsClass.selectedFundUuid` - Optionally sets as selected
- `fundsClass.createFundData` - Clears form data

### set-primary-fund.ts
Marks a fund as the primary/default fund.

**Function**: `setPrimaryFund(fundUUID: FundsUUID): Promise<boolean>`

**Behavior**:
1. Calls API to set primary fund
2. Updates `fundsClass.funds` with new primary state
3. Returns success status

## Fund State Structure

Each fund in `fundsClass.funds` map contains:
- `fundUUID` - Unique identifier
- `fundName` - Display name
- `fundCreatedAt` - Creation timestamp
- `startingAccountCashBalanceUsd` - Initial balance
- `currentAccountCashBalanceUsd` - Current cash available
- `isPrimaryFund` - Primary flag
- `positionsValueUsd` - Total value of holdings
- `positions` - Array of current positions
- `transactions` - Array of buy/sell orders (if detailed)
- `portfolioHistory` - Array of historical snapshots (if loaded)

## Usage Pattern

Typical workflow:
```
1. App loads → retrieveAllFunds()
2. User selects fund → retrieveDetailedFund(fundUUID)
3. User views performance chart → retrievePortfolioHistory(fundUUID, timeWindow)
4. User creates fund → createFund(name, balance)
5. User sets primary fund → setPrimaryFund(fundUUID)
```
