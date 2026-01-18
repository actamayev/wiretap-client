# Events Utils Directory

Utilities for fetching and managing event/market data from Polymarket.

## Files

### retrieve-all-events.ts
Fetches paginated list of prediction market events.

**Function**: `retrieveAllEvents(offset?: number): Promise<void>`

**Behavior**:
1. Prevents concurrent requests with guard checks
2. Sets `eventsClass.isRetrievingAllEvents = true`
3. Calls API with offset for pagination
4. For each event received:
   - Adds to `eventsClass.events` map
   - Subscribes to WebSocket updates for first market's first outcome
   - Retrieves price history for default timeframe ("1w")
5. Updates pagination state: `currentOffset`, `hasMoreEvents`
6. Handles errors gracefully

**State Updates**:
- `eventsClass.events` - Map of events by EventSlug
- `eventsClass.currentOffset` - Current pagination position
- `eventsClass.hasMoreEvents` - Whether more events exist
- WebSocket subscription for real-time price updates

### retrieve-single-event.ts
Fetches detailed data for a specific event including all markets and outcomes.

**Function**: `retrieveSingleEvent(eventSlug: EventSlug): Promise<void>`

**Behavior**:
1. Prevents duplicate retrieval with guard checks
2. Sets loading state: `eventsClass.retrievingSingleEvent.set(eventSlug, true)`
3. Calls API for event details
4. Adds to events map
5. Sets up WebSocket subscriptions for all outcomes
6. Retrieves price history for default timeframe

### retrieve-event-price-history.ts
Fetches historical price data for an event's outcomes across different timeframes.

**Function**: `retrieveEventPriceHistory(eventSlug: EventSlug, timeframe: keyof OutcomePriceHistories): Promise<void>`

**Behavior**:
1. Retrieves price history for all outcomes in an event
2. Updates `SingleOutcome.priceHistory` with fetched data
3. Handles loading state per outcome
4. Used for price history charts

## Usage Flow

Typical usage pattern:
```
1. Component mounts → retrieveAllEvents(0)
2. User scrolls down → retrieveAllEvents(offset)
3. User clicks event → retrieveSingleEvent(eventSlug)
4. User changes timeframe → retrieveEventPriceHistory(eventSlug, timeframe)
```

## State Dependencies

- `eventsClass` - Central event/market state management
- `polymarketWebSocketClient` - Real-time price updates
