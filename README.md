# Wiretap Client

A modern web application for paper trading prediction markets. Users can create portfolios, discover prediction markets, track performance, and simulate trading with real market data from Polymarket.

**Live Site**: [wiretap.pro](https://wiretap.pro)

## Features

### 📊 Market Discovery
- Browse hundreds of prediction markets across various categories
- Real-time price updates via WebSocket
- Detailed market information and rules
- Search and filter markets by keyword
- Infinite scroll pagination for efficient loading

### 💼 Portfolio Management
- Create multiple trading portfolios with custom initial balances
- Track active positions and historical transactions
- Monitor portfolio performance over time
- View detailed position analytics
- Set a primary portfolio for quick access

### 🎯 Paper Trading
- Buy shares in prediction market outcomes
- Sell positions and track realized profit/loss
- Real-time portfolio value updates
- Transaction history with detailed order information
- Cash balance tracking

### 📈 Performance Analytics
- Interactive price history charts for market outcomes
- Multiple timeframe views (1H, 1D, 1W, 1M, All-time)
- Portfolio performance charts
- Historical portfolio snapshots
- Real-time price data from Polymarket CLOB API

### 🔐 User Account
- Email/password authentication
- Google OAuth single sign-on
- Secure password management
- User profile settings
- Session management

### 💬 User Engagement
- Send feedback directly to the platform
- Contact form for inquiries
- Social media integration (Discord, X/Twitter)

## Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) - React meta-framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **State Management**: [MobX](https://mobx.js.org/) - Reactive state management
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Headless component library
- **Forms**: [React Hook Form](https://react-hook-form.com/) - Performant form handling
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **HTTP Client**: [Axios](https://axios-http.com/) - Promise-based HTTP client
- **Charts**: [Recharts](https://recharts.org/) - Composable charting library
- **Analytics**: [React GA4](https://www.npmjs.com/package/react-ga4) - Google Analytics 4
- **OAuth**: [@react-oauth/google](https://github.com/react-oauth/google) - Google Sign-In

### Development
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, space-efficient package manager
- **Linting**: [ESLint](https://eslint.org/) - Code quality
- **Build Tool**: Next.js (Webpack-based)

## Project Structure

```
wiretap-client/
├── app/                      # Next.js App Router (routes & layouts)
├── src/
│   ├── classes/              # MobX state management (singletons)
│   │   ├── auth-class.ts
│   │   ├── events-class.ts
│   │   ├── funds-class.ts
│   │   ├── trade-class.ts
│   │   ├── personal-info-class.ts
│   │   ├── polymarket-websocket-client.ts
│   │   └── CLAUDE.md         # Architecture documentation
│   ├── components/           # React components
│   │   ├── ui/               # Design system (shadcn/ui)
│   │   ├── layouts/          # Page layouts
│   │   ├── sidebar/          # Navigation
│   │   ├── events/           # Event listing components
│   │   ├── event/            # Event detail & trading
│   │   ├── funds/            # Portfolio components
│   │   ├── auth/             # Authentication UI
│   │   ├── profile/          # User account settings
│   │   └── CLAUDE.md         # Component documentation
│   ├── hooks/                # Custom React hooks
│   │   ├── navigate/
│   │   ├── google-auth/
│   │   ├── shadcn/
│   │   └── CLAUDE.md
│   ├── services/             # API data services
│   │   ├── auth-data-service.ts
│   │   ├── events-data-service.ts
│   │   ├── funds-data-service.ts
│   │   ├── trade-data-service.ts
│   │   └── CLAUDE.md
│   ├── types/                # TypeScript type definitions
│   │   ├── common/
│   │   ├── events.ts
│   │   ├── polymarket.ts
│   │   └── CLAUDE.md
│   ├── utils/                # Feature-organized utilities
│   │   ├── auth/
│   │   ├── events/
│   │   ├── funds/
│   │   ├── trade/
│   │   ├── polymarket/
│   │   ├── constants/
│   │   ├── seo/
│   │   └── CLAUDE.md
│   ├── page-components/      # Top-level page components
│   ├── lib/                  # Helper libraries
│   ├── icons/                # SVG icon components
│   └── styles/               # Global styles
├── public/                   # Static assets
├── CLAUDE.md                 # Codebase architecture guide
├── README.md                 # This file
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.mjs
└── eslint.config.mjs
```

For detailed documentation on each directory, see the [CLAUDE.md](CLAUDE.md) file.

## Getting Started

### Prerequisites
- Node.js 18+ (or use nvm)
- pnpm 8+ (or `npm install -g pnpm`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wiretap-client.git
   cd wiretap-client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.sample .env
   ```

   Then edit `.env` with your configuration:
   ```env
   # API
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

   # Analytics
   NEXT_PUBLIC_MEASUREMENT_ID=G-XXXXXXXXXX

   # Authentication
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Commands

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm dev --open       # Open in browser automatically

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
pnpm format           # Format code with Prettier (if configured)

# Clean
pnpm clean            # Remove .next build artifacts
```

### Project Structure for Development

#### Adding a New Feature

1. **Define Types** - Create types in `/src/types/`
   ```typescript
   // src/types/my-feature.ts
   interface MyFeatureData {
     id: string
     name: string
   }
   ```

2. **Create State Class** - Add to `/src/classes/` if needed
   ```typescript
   import { makeAutoObservable } from "mobx"

   class MyFeatureClass {
     data: MyFeatureData | null = null
     isLoading = false

     constructor() {
       makeAutoObservable(this)
     }
   }
   ```

3. **Create API Service** - Add to `/src/services/`
   ```typescript
   export default class MyFeatureService extends BaseDataService {
     async fetch() {
       return this.httpClient.http.get(this.buildUrl("/endpoint"))
     }
   }
   ```

4. **Create Utilities** - Add to `/src/utils/my-feature/`
   ```typescript
   export async function fetchMyFeature() {
     // Validation, API call, state update
   }
   ```

5. **Create Components** - Add to `/src/components/my-feature/`
   ```typescript
   import { observer } from "mobx-react"

   export const MyFeatureComponent = observer(() => {
     return <div>{/* UI */}</div>
   })
   ```

#### Code Organization Principles

- **Feature-Driven**: Code grouped by feature (auth, events, funds, etc.)
- **Type-Safe**: Full TypeScript with branded types for domain IDs
- **Separation of Concerns**: UI in components, logic in utilities, state in classes
- **Error Handling**: Errors handled in utilities, not propagated to components
- **Reactive State**: MobX classes auto-tracked with `makeAutoObservable()`
- **Guard Checks**: Prevent duplicate API requests with loading flags

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

## Architecture

### Data Flow

```
User Interaction (Component)
           ↓
     Hook / Utility Function
           ↓
     API Data Service
           ↓
       Backend API
           ↓
    Response / Error
           ↓
   Update State Class (MobX)
           ↓
  Component Re-renders (observer)
```

### State Management

Global state is managed through MobX singleton classes:

- **authClass** - Authentication and user login state
- **personalInfoClass** - User profile information
- **fundsClass** - Portfolio and fund data
- **eventsClass** - Markets and events data
- **tradeClass** - Trading operations state
- **polymarketWebSocketClient** - Real-time price updates

Components use the `observer()` HOC to reactively render when state changes.

### Real-Time Updates

The app uses WebSocket connections to Polymarket for real-time price data:

```
PolymarketWebSocketClient
           ↓
    Polymarket WS
           ↓
  Price Updates
           ↓
Update eventsClass/fundsClass
           ↓
Components re-render
```

## API Integration

The app communicates with a backend API for:

- User authentication (login, register, Google OAuth)
- Event and market data
- Portfolio management
- Trade execution
- User profile settings

All API communication is handled through data services in `/src/services/`.

### Error Handling

API errors are extracted and presented to users via:
- Toast notifications for temporary errors
- Dialog modals for critical errors
- Inline form validation errors
- Graceful fallbacks when data is unavailable

## Performance

### Optimizations

- **Pagination**: Events use offset-based pagination to prevent loading too much data
- **WebSocket**: Real-time price updates instead of polling
- **Guard Checks**: API requests prevented if already loading/loaded
- **Code Splitting**: Next.js automatically splits code by route
- **Lazy Loading**: Components loaded on demand
- **Responsive Images**: Optimized image serving via Next.js Image

### Monitoring

- Google Analytics 4 for user analytics
- Error tracking (if configured)
- Real-time monitoring in development via Next.js DevTools

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Mobile browsers supported on iOS and Android.

## Environment Variables

Create a `.env` file based on `.env.sample`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Analytics
NEXT_PUBLIC_MEASUREMENT_ID=G-XXXXXXXXXX

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com

# Node Environment
NODE_ENV=development
```

See `.env.sample` for all available variables.

## Troubleshooting

### Port Already in Use

If port 3000 is in use:

```bash
pnpm dev -- -p 3001
```

### Dependencies Issues

Clear cache and reinstall:

```bash
pnpm install --force
```

### TypeScript Errors

Run type checking:

```bash
pnpm type-check
```

### Build Failures

Check the build output:

```bash
pnpm build
```

## Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Deployment Platforms

- **Vercel** (Recommended for Next.js)
  ```bash
  vercel deploy
  ```

- **Other Platforms**: Follow standard Node.js deployment procedures

## Contributing

### Code Style

- Use TypeScript for all files (`.ts`, `.tsx`)
- Follow existing naming conventions
- Use Prettier for formatting (if configured)
- ESLint rules enforced in CI/CD

## Documentation

- **[CLAUDE.md](CLAUDE.md)** - Comprehensive codebase architecture guide
- **[/src/types/CLAUDE.md](/src/types/CLAUDE.md)** - Type definitions documentation
- **[/src/classes/CLAUDE.md](/src/classes/CLAUDE.md)** - State management documentation
- **[/src/services/CLAUDE.md](/src/services/CLAUDE.md)** - API services documentation
- **[/src/components/CLAUDE.md](/src/components/CLAUDE.md)** - Component architecture
- **[/src/utils/CLAUDE.md](/src/utils/CLAUDE.md)** - Utility functions by feature
- **[/src/hooks/CLAUDE.md](/src/hooks/CLAUDE.md)** - Custom hooks documentation

## Security

### Best Practices Implemented

- ✅ HTTPS/TLS encryption in production
- ✅ Secure password hashing on backend
- ✅ CSRF protection
- ✅ Input validation (Zod schemas)
- ✅ XSS protection (React escapes by default)
- ✅ Environment variables for secrets (never in code)
- ✅ Secure authentication tokens (httpOnly cookies via backend)
