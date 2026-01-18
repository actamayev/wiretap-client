# Polymarket Utils Directory

Polymarket-specific utilities for market data and price history retrieval.

## Files

### retrieve-outcome-price-history.ts
Fetches historical price data for prediction market outcomes from Polymarket CLOB API.

**Function**: `retrieveOutcomePriceHistory(clobTokenId: ClobTokenId, params: PriceHistoryParams): Promise<PriceHistoryEntry[]>`

**Parameters**:
- `clobTokenId` - Token identifier for the specific market outcome
- `startTimestamp` (optional) - Unix timestamp in milliseconds
- `endTimestamp` (optional) - Unix timestamp in milliseconds
- `fidelity` (optional) - Number of data points to return (lower = fewer points, faster response)

**Returns**: Array of price history entries with:
- `t` - Timestamp (milliseconds since epoch)
- `p` - Price (0-1 decimal representing probability)
- `isWebSocket` - Boolean (false for API data, true for WebSocket data)

**Behavior**:
1. Constructs query parameters with optional timestamps and fidelity
2. Calls Polymarket CLOB REST API
3. Converts timestamps from API response
4. Returns formatted price history array
5. Used for price history charts

**Timeframe Mapping**:
Different timeframes have different fidelity settings:
- `"1h"` - High fidelity for detailed 1-hour view
- `"1d"` - Daily fidelity
- `"1w"` - Weekly fidelity (default)
- `"1m"` - Monthly fidelity
- `"max"` - All-time data

## Integration Points

**Used by**:
- `retrieve-event-price-history.ts` - Fetches data for all outcomes in an event
- `SingleOutcome.priceHistory` - Stores data in state

**Configuration**:
- API base URL from `polymarket-constants.ts`
- Timeframe config from `polymarket-constants.ts`

## Error Handling

- Network errors are caught and logged
- Returns empty array on failure
- Loading states managed by calling functions

## Data Format

Price data points represent market probability (odds):
- `0.0` = 0% probability (outcome cannot happen)
- `0.5` = 50% probability (even odds)
- `1.0` = 100% probability (outcome will happen)
