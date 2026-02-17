# Cadlix

A modern React application for managing your anime collection and tracking your progress.

## 🚀 Features

### Security
- **Protected Routes**: Authentication-required routes that redirect unauthorized users
- **XSS Protection**: Input sanitization to prevent cross-site scripting attacks
- **Form Validation**: Client-side validation with real-time error feedback
- **Password Strength Validation**: Enforces secure password requirements

### User Experience
- **Toast Notifications**: Non-intrusive feedback for user actions
- **Loading States**: Skeleton screens and loading indicators
- **Error Boundaries**: Graceful error handling without crashing the app
- **Responsive Design**: Mobile-first approach with breakpoints for all devices

### Accessibility
- **ARIA Labels**: Proper semantic HTML and screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators and logical tab order
- **Reduced Motion**: Respects user preferences for animations

### Components
- **Button**: Multiple variants (primary, secondary, danger, ghost) with loading states
- **Input**: Validated input fields with error states and icons
- **Toast**: Notification system with auto-dismiss
- **Skeleton**: Loading placeholders for better perceived performance
- **ProtectedRoute**: Route guard for authentication
- **ErrorBoundary**: Error catching and graceful degradation

## 🛠️ Tech Stack

- **Frontend**: React 19 with Hooks
- **Routing**: React Router v7
- **Build Tool**: Vite 7
- **Linting**: ESLint with React Hooks rules
- **Styling**: CSS with CSS Variables
- **Icons**: Boxicons

## 📁 Project Structure

```
src/
├── components/
│   └── common/
│       ├── Button.jsx        # Reusable button component
│       ├── Button.css
│       ├── Input.jsx         # Form input with validation
│       ├── Input.css
│       ├── Toast.jsx         # Notification system
│       ├── Toast.css
│       ├── Skeleton.jsx      # Loading placeholders
│       ├── Skeleton.css
│       ├── ErrorBoundary.jsx # Error handling
│       ├── ErrorBoundary.css
│       └── ProtectedRoute.jsx # Auth route guard
├── context/
│   ├── UserContext.js
│   ├── UserProvider.jsx
│   ├── useUser.js
│   └── userData.js
├── hooks/
│   └── useFormValidation.js  # Form validation hook
├── ui/
│   └── pages/
│       ├── login/
│       │   ├── Login.jsx
│       │   └── Login.css
│       ├── home/
│       │   ├── Home.jsx
│       │   └── Home.css
│       └── profile/
│           ├── Profile.jsx
│           └── Profile.css
├── utils/
│   ├── security.js           # XSS protection, validation
│   └── constants.js          # App constants
├── App.jsx
├── main.jsx
└── index.css
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

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

# Run linter
npm run lint
```

## 🔒 Security Best Practices

### Input Sanitization
All user inputs are sanitized using the `sanitizeInput` utility to prevent XSS attacks:

```javascript
import { sanitizeInput } from './utils/security.js';

const cleanInput = sanitizeInput(userInput);
```

### Form Validation
Forms use the `useFormValidation` hook with configurable rules:

```javascript
import { useFormValidation, validators } from './hooks/useFormValidation.js';

const validationRules = {
  email: [
    validators.required('Email is required'),
    validators.email('Invalid email format'),
  ],
};

const { values, errors, handleChange, handleBlur, validateAll } = useFormValidation(
  initialValues,
  validationRules
);
```

### Protected Routes
Wrap routes that require authentication:

```javascript
<Route 
  path="/home" 
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  } 
/>
```

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Wide**: > 1024px

### Mobile-First Approach
All styles are written mobile-first and enhanced for larger screens:

```css
/* Mobile styles (default) */
.component {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 24px;
  }
}
```

## ♿ Accessibility

### ARIA Attributes
All interactive elements have proper ARIA attributes:
- `aria-label` for icon buttons
- `aria-invalid` for form validation
- `aria-live` for dynamic content
- `role` attributes for semantic structure

### Keyboard Navigation
- Full tab navigation support
- Focus traps in modals
- Escape key handling
- Enter/Space key activation

### Screen Reader Support
- Semantic HTML5 elements
- Hidden decorative icons (`aria-hidden="true"`)
- Descriptive labels
- Live regions for notifications

## 🎯 Code Quality

### ESLint Configuration
The project uses strict ESLint rules including:
- React Hooks rules
- PropTypes validation
- Fast refresh compatibility
- JSX accessibility rules

### Component Guidelines
1. Use PropTypes for type checking
2. Export only one component per file (for Fast Refresh)
3. Use `useId()` for unique IDs instead of `Math.random()`
4. Handle errors in async functions

## 📝 Component Usage

### Button
```jsx
import Button from './components/common/Button.jsx';

<Button 
  variant="primary"      // primary | secondary | danger | ghost | accent
  size="medium"          // small | medium | large
  isLoading={false}      // boolean
  disabled={false}       // boolean
  onClick={handleClick}
>
  Click Me
</Button>
```

### Input
```jsx
import Input from './components/common/Input.jsx';

<Input
  label="Email"
  type="email"
  name="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.email}
  touched={touched.email}
  required
  icon="✉"
/>
```

### Toast Notifications
```jsx
import { useToast } from './components/common/Toast.jsx';

const toast = useToast();

toast.success('Operation successful!');
toast.error('Something went wrong');
toast.warning('Please check your input');
toast.info('New update available');
```

## 🎨 CSS Variables

The app uses CSS variables for consistent theming:

```css
:root {
  /* Dark Backgrounds */
  --color-bg-dark: #0A0F3D;
  --color-bg-primary: #151B4D;
  --color-bg-secondary: #21295F;
  --color-bg-card: #1E1B51;
  --color-bg-hover: #2C2971;
  
  /* Accent Colors */
  --color-accent-purple: #8A2BE2;
  --color-accent-pink: #FF1493;
  --color-accent-teal: #00CED1;
  --color-accent-blue: #4682B4;
  
  /* Text Colors */
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.87);
  --color-text-muted: rgba(255, 255, 255, 0.6);
}
```

## 🤝 Contributing

1. Follow the existing code style
2. Write PropTypes for all components
3. Ensure accessibility standards
4. Test on multiple screen sizes
5. Run the linter before committing

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Built with React and Vite
- Icons by Boxicons
- Inspired by modern web development best practices
