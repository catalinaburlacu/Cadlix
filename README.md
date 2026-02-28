# Cadlix

A modern React 19 streaming platform for anime, movies, and series with enterprise-grade features, PWA support, and production-ready performance.

## 🚀 What's New in 2025

### Progressive Web App (PWA)
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile and desktop
- **Background Sync**: Queue actions while offline
- **Service Worker**: Automatic updates and caching strategies
- **App Shell**: Instant loading with skeleton UI

### Performance Optimizations
- **Code Splitting**: Lazy-loaded routes for faster initial load
- **Modern CSS**: Container queries, CSS layers, logical properties
- **Critical CSS**: Inline critical styles for faster first paint
- **Resource Hints**: Preconnect and DNS prefetch for external resources
- **GPU Acceleration**: Hardware-accelerated animations

### Developer Experience
- **TypeScript Ready**: Full type safety configuration
- **Modern Tooling**: ESLint 9, Prettier, Husky pre-commit hooks
- **Testing Suite**: Vitest + React Testing Library + Playwright E2E
- **Path Aliases**: Clean imports with `@/` aliases
- **Hot Reload**: Fast refresh with Vite 7

## ✨ Features

### Core Features
- **Stream Content**: Browse and discover anime, movies, and series
- **User Profiles**: Customizable profiles with avatar upload
- **Watch History**: Track viewing progress across devices
- **Favorites**: Save and organize your favorite content
- **Subscription Plans**: Multiple tiers (Genin, Chunin, Hokage)
- **Payment Integration**: Secure payment processing

### Security
- **Protected Routes**: Authentication-required routes with redirects
- **XSS Protection**: Input sanitization and output encoding
- **Form Validation**: Client-side validation with real-time feedback
- **CSRF Protection**: Token-based protection ready for backend
- **Content Security Policy**: Ready for implementation

### User Experience
- **Toast Notifications**: Non-intrusive feedback system
- **Skeleton Loading**: Better perceived performance
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first with container queries
- **Reduced Motion**: Respects user accessibility preferences

### Accessibility (WCAG 2.1 AA)
- **Skip Links**: Keyboard navigation support
- **ARIA Labels**: Proper semantic HTML
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Full screen reader compatibility
- **Color Contrast**: 4.5:1 minimum contrast ratio

## 🛠️ Tech Stack

### Core
- **React**: 19.x with latest features
- **React Router**: 7.x with data APIs
- **Vite**: 7.x with PWA plugin
- **Boxicons**: Modern icon library

### Modern Web Standards
- **ES2022**: Latest JavaScript features
- **CSS Layers**: Organized cascade architecture
- **Container Queries**: Component-based responsive design
- **CSS Logical Properties**: RTL support
- **View Transitions API**: Ready for implementation

### Development Tools
- **ESLint 9**: Flat config with modern rules
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for quality gates
- **Vitest**: Fast unit testing
- **Playwright**: End-to-end testing

## 📁 Project Structure

```
src/
├── components/
│   └── common/
│       ├── Button.jsx          # Reusable button with variants
│       ├── Button.css
│       ├── Input.jsx           # Form input with validation
│       ├── Input.css
│       ├── Toast.jsx           # Notification system
│       ├── Toast.css
│       ├── Skeleton.jsx        # Loading placeholders
│       ├── Skeleton.css
│       ├── ErrorBoundary.jsx   # Error handling
│       ├── ErrorBoundary.css
│       ├── ProtectedRoute.jsx  # Auth route guard
│       ├── PageLoader.jsx      # Route transition loader
│       ├── PageLoader.css
│       ├── OfflineFallback.jsx # Offline state UI
│       ├── OfflineFallback.css
│       └── InitialLoader.jsx   # App startup loader
├── context/
│   ├── UserContext.js
│   ├── UserProvider.jsx
│   ├── useUser.js
│   └── userData.js
├── hooks/
│   ├── useFormValidation.js
│   └── useToast.js
├── styles/
│   └── modern-base.css         # Modern CSS architecture
├── ui/
│   └── pages/
│       ├── login/
│       ├── home/
│       ├── explore/
│       ├── profile/
│       ├── subscriptions/
│       ├── payment/
│       └── history/
├── utils/
│   ├── security.js
│   └── constants.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20+ 
- npm 10+ or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Cadlix

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
# Code quality
npm run lint              # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run format            # Format with Prettier
npm run format:check      # Check formatting

# Type checking
npm run typecheck         # Check TypeScript types

# Testing
npm run test              # Run unit tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Generate coverage report
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run E2E tests with UI

# Build
npm run build:analyze     # Build with bundle analysis
```

## 📱 PWA Features

### Installation
Users can install Cadlix as a standalone app:
- **Desktop**: Click install icon in address bar
- **Mobile**: "Add to Home Screen" from browser menu
- **Chrome**: Automatic install prompt

### Offline Capabilities
- Cached pages work without internet
- Avatar images cached for offline viewing
- Queued actions sync when back online
- Fallback UI for uncached content

### Service Worker
- Automatic updates when new version available
- Background sync for form submissions
- Push notification ready
- Custom caching strategies per resource type

## 🎨 Design System

### CSS Architecture
Uses modern CSS with `@layer` for cascade organization:

```css
@layer reset, base, components, utilities, overrides;
```

### Design Tokens
```css
:root {
  /* Colors */
  --color-bg-dark: #0A0F3D;
  --color-accent-purple: #8A2BE2;
  --color-accent-pink: #FF1493;
  
  /* Spacing (8px base) */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  
  /* Typography (fluid) */
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  
  /* Shadows */
  --shadow-glow-purple: 0 4px 20px rgba(138, 43, 226, 0.4);
}
```

### Container Queries
Responsive components based on container width:

```css
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## 🔒 Security

### Input Sanitization
```javascript
import { sanitizeInput } from './utils/security.js'

const cleanInput = sanitizeInput(userInput)
```

### Form Validation
```javascript
import { useFormValidation, validators } from './hooks/useFormValidation.js'

const validationRules = {
  email: [
    validators.required('Email is required'),
    validators.email('Invalid email format'),
  ],
}

const { values, errors, handleChange, handleBlur, validateAll } = useFormValidation(
  initialValues,
  validationRules
)
```

### Protected Routes
```jsx
<Route 
  path="/home" 
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  } 
/>
```

## ♿ Accessibility

### Skip Navigation
```jsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<main id="main-content">
  {/* Page content */}
</main>
```

### ARIA Attributes
- `aria-label` for icon buttons
- `aria-invalid` for form validation
- `aria-live` for dynamic content
- `role` for semantic structure

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📊 Performance Targets

### Core Web Vitals
- **FCP**: < 1.0s
- **LCP**: < 1.5s
- **TTI**: < 2.5s
- **CLS**: < 0.05
- **FCP**: < 1.8s

### Bundle Size
- Initial load: < 200KB gzipped
- Lazy-loaded chunks: < 100KB each

## 🔧 Configuration

### Path Aliases
Configure in `vite.config.js`:
```javascript
resolve: {
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@pages': '/src/ui/pages',
    // ... more aliases
  }
}
```

### Environment Variables
Create `.env` files:
```
VITE_API_URL=https://api.cadlix.app
VITE_APP_NAME=Cadlix
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Quality Gates
- All tests must pass
- ESLint checks must pass
- Code must be formatted with Prettier
- Commit messages follow conventional format

## 📝 Component Usage

### Button
```jsx
import Button from './components/common/Button'

<Button 
  variant="primary"      // primary | secondary | danger | ghost
  size="medium"          // small | medium | large
  isLoading={false}
  disabled={false}
  onClick={handleClick}
>
  Click Me
</Button>
```

### Input
```jsx
import Input from './components/common/Input'

<Input
  label="Email"
  type="email"
  name="email"
  value={values.email}
  onChange={handleChange}
  error={errors.email}
  required
  icon="bx-envelope"
/>
```

### Toast Notifications
```jsx
import { useToast } from './hooks/useToast'

const toast = useToast()

toast.success('Operation successful!')
toast.error('Something went wrong')
toast.warning('Please check your input')
toast.info('New update available')
```

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Built with React 19 and Vite 7
- Icons by Boxicons
- PWA powered by Vite PWA plugin
- Modern CSS inspired by web standards
