# Constants Utils Directory

Application-wide configuration constants that don't change at runtime.

## Files

### polymarket-constants.ts
Polymarket API and WebSocket configuration.

**Constants**:
- `POLYMARKET_WS_URL` - WebSocket endpoint for real-time price updates
- `PING_INTERVAL_MS` - Keep-alive ping interval (in milliseconds)
- `POLYMARKET_CLOB_API_BASE` - REST API base URL for historical data

**Timeframe Configuration**: `timeframeConfig`
Maps timeframe keys to display labels and API fidelity parameters:
- `"1h"` - 1 hour with high fidelity
- `"1d"` - 1 day
- `"1w"` - 1 week (default timeframe)
- `"1m"` - 1 month
- `"max"` - All time

Each timeframe has:
- `label` - Human-readable display name
- `fidelity` - Number of data points returned by API

## Usage

Import constants throughout the app:

```typescript
import { POLYMARKET_WS_URL, PING_INTERVAL_MS, timeframeConfig } from "@/utils/constants/polymarket-constants"
```

Used in:
- `polymarket-websocket-client.ts` - WebSocket connection setup
- `events-class.ts` - Timeframe selection and display
- Price history retrieval functions

## Adding New Constants

1. Group related constants by feature
2. Create a new file: `<feature>-constants.ts`
3. Document each constant with its purpose and expected format
4. Export as named exports (not default)
