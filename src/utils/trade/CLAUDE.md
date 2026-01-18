# Trade Utils Directory

Trading execution utilities for buying and selling shares in prediction markets.

## Files

### buy-shares.ts
Executes a share purchase in a prediction market.

**Function**: `buyShares(marketId: MarketId, clobToken: ClobTokenId, amountUsd: number, fundUUID: FundsUUID): Promise<SinglePosition | null>`

**Parameters**:
- `marketId` - Market identifier
- `clobToken` - Token ID for the specific outcome to purchase
- `amountUsd` - USD amount to spend
- `fundUUID` - Fund/portfolio to buy into

**Behavior**:
1. Validates all inputs:
   - Market ID is not null
   - CLOB token is not empty
   - Amount is positive number
   - Fund UUID is selected
2. Sets loading state: `tradeClass.isBuyingShares = true`
3. Calls API via `wiretapApiClient.tradeDataService.buy()`
4. On success:
   - Updates `fundsClass` with new position
   - Updates fund's cash balance
   - Adds transaction to history
   - Returns position object
5. On failure:
   - Displays error message
   - Returns null

**Response Includes**:
- New `SinglePosition` object with shares purchased
- Updated `newAccountCashBalance`
- Success message

### sell-shares.ts
Executes a share sale in a prediction market.

**Function**: `sellShares(position: SinglePosition, numberOfShares: number, fundUUID: FundsUUID): Promise<boolean>`

**Parameters**:
- `position` - The position object to sell from
- `numberOfShares` - Number of shares to sell
- `fundUUID` - Fund containing the position

**Behavior**:
1. Validates inputs:
   - numberOfShares is positive and ≤ current holdings
   - Fund UUID is selected
2. Sets loading state: `tradeClass.isSellingShares = true`
3. Calls API via `wiretapApiClient.tradeDataService.sell()`
4. On success:
   - Updates `fundsClass.funds` with:
     - New cash balance
     - Remaining positions (or removes if closed)
     - Transaction history
   - Calculates realized P&L
   - Returns true
5. On failure:
   - Displays error message
   - Returns false

**Response Includes**:
- `numberOfSharesSold` - Shares actually sold
- `pricePerShare` - Sale price
- `totalProceeds` - Revenue from sale
- `realizedPnl` - Profit/loss on this trade
- `newAccountCashBalance` - Updated cash
- `remainingPositions` - Updated positions list
- `positionClosed` - Whether position was fully sold

## Trading Workflow

Typical buy-then-sell flow:
```
1. User selects market outcome
2. User enters amount to spend
3. buyShares() executes purchase
4. Position added to portfolio
5. User later decides to sell
6. sellShares() executes sale
7. P&L calculated and displayed
```

## State Updates

Both functions update `fundsClass.funds`:
- `positions` - Array of open positions
- `currentAccountCashBalanceUsd` - Available cash
- `transactions` - Purchase and sale orders

## Error Handling

- Input validation prevents invalid trades
- API errors are caught and displayed
- Loading states prevent duplicate submissions
- Both functions return success indicator

## Risk Management

- Cannot sell more shares than owned
- Cannot spend more than available cash (validated by API)
- Partial fills handled by API
