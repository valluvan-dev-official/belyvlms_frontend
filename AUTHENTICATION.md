# Authentication System Documentation

## Overview
BeLyv LMS now includes a complete authentication system with protected routes, login/logout functionality, and session persistence.

## Features

### 🔐 Authentication
- **Login Page**: Pixel-perfect implementation matching the provided design
- **Protected Routes**: All application routes require authentication
- **Session Persistence**: Login state persists across page refreshes
- **Automatic Redirects**: Seamless navigation between login and protected pages

### 🚪 Login Page (`/login`)

#### Design Elements
- **Left Panel**: Hero image with student reading (orange/red circular background)
- **Right Panel**: Login form with:
  - Logo with heart icon
  - Email input field
  - Password input field with show/hide toggle
  - "Remember me" checkbox
  - "Forgot Password?" link
  - Orange "Sign In" button
  - "Sign in with google" button with Google logo
  - "Sign Up" link
  - Social media icons (Facebook, Instagram, Pinterest)
  - Copyright text: "© 2022 All rights reserved educationpro"

#### Functionality
- **Email Validation**: Required field with email format validation
- **Password Toggle**: Eye icon to show/hide password
- **Remember Me**: Checkbox option (ready for implementation)
- **Error Handling**: Display error messages for invalid credentials
- **Loading State**: Shows "Signing in..." during authentication
- **Google Sign In**: Button ready for OAuth integration

#### Test Credentials
- **Any valid email**: Any email format will work
- **Any password**: Any non-empty password will work
- Example: `user@example.com` / `password123`

---

## Protected Routes

All routes except `/login` are protected and require authentication:

| Route | Protected | Redirect If Not Authenticated |
|-------|-----------|-------------------------------|
| `/login` | ❌ No | - |
| `/` | ✅ Yes | → `/login` |
| `/dashboard` | ✅ Yes | → `/login` |
| `/admin/dashboard` | ✅ Yes | → `/login` |
| `/management/users` | ✅ Yes | → `/login` |
| `/profile` | ✅ Yes | → `/login` |

---

## Authentication Flow

### 1. First Visit (Not Authenticated)
```
User visits any URL
    ↓
Check authentication status
    ↓
Not authenticated → Redirect to /login
```

### 2. Login Process
```
User enters credentials on /login
    ↓
Submit form → Validate credentials
    ↓
Success → Store user data
    ↓
Redirect to /dashboard
```

### 3. Session Persistence
```
User refreshes page
    ↓
Check localStorage for user data
    ↓
User found → Restore session
    ↓
Stay on current page
```

### 4. Logout Process
```
User clicks Logout button
    ↓
Clear user data from localStorage
    ↓
Update authentication state
    ↓
Redirect to /login
```

---

## Technical Implementation

### File Structure
```
/src/app
├── /context
│   └── AuthContext.tsx          # Authentication state management
├── /components
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   └── ProfileWidget.tsx        # Includes logout button
├── /pages
│   └── LoginPage.tsx            # Login page component
└── App.tsx                      # Router configuration
```

### AuthContext

**Location**: `/src/app/context/AuthContext.tsx`

**Features**:
- Creates authentication context
- Manages user state
- Provides login/logout functions
- Handles session persistence with localStorage

**API**:
```typescript
interface AuthContextType {
  user: User | null;              // Current user data
  isAuthenticated: boolean;        // Authentication status
  isLoading: boolean;              // Loading state
  login: (email, password) => Promise<void>;  // Login function
  logout: () => void;              // Logout function
}
```

**Usage**:
```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ... component code
}
```

### ProtectedRoute Component

**Location**: `/src/app/components/ProtectedRoute.tsx`

**Purpose**: Wraps protected routes to enforce authentication

**Behavior**:
- Checks if user is authenticated
- Shows loading spinner during initial check
- Redirects to `/login` if not authenticated
- Renders children if authenticated

**Usage**:
```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <StudentDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
```

### Login Page Component

**Location**: `/src/app/pages/LoginPage.tsx`

**State Management**:
- `email`: User's email input
- `password`: User's password input
- `showPassword`: Toggle password visibility
- `rememberMe`: Remember me checkbox state
- `error`: Error message display
- `isLoading`: Loading state during login

**Form Validation**:
- Email: Required, must be valid email format
- Password: Required, any non-empty value

**Error Handling**:
- Displays error message for invalid credentials
- Shows loading state during authentication
- Disables submit button during processing

---

## User Interface

### Login Page Design

#### Colors
- **Primary Button**: #FF5722 (Orange)
- **Button Hover**: #E64A19 (Darker Orange)
- **Border**: #E0E0E2 (Light Gray)
- **Text Primary**: #1A1D1F (Dark)
- **Text Secondary**: #6E7191 (Gray)
- **Background**: #F5F5F5 (Light Gray)
- **Error**: #E63946 (Red)

#### Layout
- **Desktop**: Side-by-side panels (image left, form right)
- **Tablet**: Side-by-side panels with adjusted spacing
- **Mobile**: Stacked panels (image top, form bottom)

#### Responsive Breakpoints
- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1023px (side-by-side)
- **Desktop**: ≥ 1024px (full side-by-side)

### Logout Button

**Location**: Two places
1. **ProfileWidget**: Bottom of right sidebar (on dashboard pages)
2. Can be added to header/dropdown menu if needed

**Appearance**:
- Icon: LogOut icon from lucide-react
- Text: "Logout"
- Style: Same as Profile button
- Hover: Border changes to teal (#4ECDC4)

---

## Security Considerations

### Current Implementation (Demo)
⚠️ **Note**: Current authentication is for demonstration purposes only

- **No Backend**: Authentication happens client-side
- **No Real Validation**: Any email/password combination works
- **localStorage**: User data stored in browser localStorage
- **No Encryption**: Data not encrypted in storage

### Production Recommendations

#### 1. Backend Integration
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) throw new Error('Invalid credentials');
  
  const data = await response.json();
  setUser(data.user);
  localStorage.setItem('token', data.token);
};
```

#### 2. JWT Tokens
- Store JWT token instead of user data
- Include token in API request headers
- Implement token refresh mechanism
- Set appropriate expiration times

#### 3. Secure Storage
- Use httpOnly cookies for tokens
- Implement CSRF protection
- Add XSS protection
- Sanitize all user inputs

#### 4. Password Security
- Minimum password requirements
- Password strength indicator
- Rate limiting for login attempts
- Account lockout after failed attempts
- Two-factor authentication (2FA)

#### 5. API Security
- HTTPS only
- CORS configuration
- Rate limiting
- Input validation
- SQL injection protection

---

## Testing

### Manual Testing Checklist

**Login Flow**:
- [ ] Visit `/login` page
- [ ] Enter email and password
- [ ] Click "Sign In" button
- [ ] Verify redirect to `/dashboard`
- [ ] Check user data stored in localStorage

**Protected Routes**:
- [ ] Try accessing `/dashboard` without login → Should redirect to `/login`
- [ ] Try accessing `/admin/dashboard` without login → Should redirect to `/login`
- [ ] Try accessing `/management/users` without login → Should redirect to `/login`
- [ ] Try accessing `/profile` without login → Should redirect to `/login`

**Session Persistence**:
- [ ] Login successfully
- [ ] Refresh page
- [ ] Verify still logged in
- [ ] Navigate between protected pages
- [ ] Verify no redirect to login

**Logout Flow**:
- [ ] Click logout button in ProfileWidget
- [ ] Verify redirect to `/login`
- [ ] Check localStorage cleared
- [ ] Try accessing protected route → Should redirect to `/login`

**UI Elements**:
- [ ] Password show/hide toggle works
- [ ] Remember me checkbox toggles
- [ ] Error message displays for invalid credentials
- [ ] Loading state shows during authentication
- [ ] Form validation prevents empty submissions
- [ ] Google sign-in button is visible (not functional)
- [ ] Social media icons are visible
- [ ] Responsive design works on all screen sizes

---

## Usage Examples

### Example 1: Login
1. Open application
2. You'll be automatically redirected to `/login`
3. Enter any email (e.g., `student@belyv.com`)
4. Enter any password (e.g., `password123`)
5. Click "Sign In"
6. You'll be redirected to `/dashboard`

### Example 2: Navigate Application
1. After login, click any sidebar menu item
2. Navigate freely between pages
3. All pages remain accessible
4. No re-authentication required

### Example 3: Session Persistence
1. Login to the application
2. Close the browser tab
3. Open application again
4. You'll remain logged in
5. No need to login again

### Example 4: Logout
1. Navigate to a dashboard page (Student or Admin)
2. Look at the right ProfileWidget panel
3. Scroll to bottom
4. Click "Logout" button
5. You'll be redirected to login page
6. Try accessing any protected route → redirected back to login

---

## Customization

### Change Login Credentials Validation
Edit `/src/app/context/AuthContext.tsx`:

```typescript
const login = async (email: string, password: string) => {
  // Add your custom validation logic
  if (email === 'admin@belyv.com' && password === 'admin123') {
    // Valid credentials
    const userData = { email, name: 'Admin User' };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return Promise.resolve();
  } else {
    // Invalid credentials
    return Promise.reject(new Error('Invalid credentials'));
  }
};
```

### Add Role-Based Access Control
Edit `AuthContext.tsx`:

```typescript
interface User {
  email: string;
  name: string;
  role: 'student' | 'admin' | 'instructor';  // Add role
}

// In ProtectedRoute.tsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

### Customize Login Page
Edit `/src/app/pages/LoginPage.tsx`:

- Change colors by updating hex values
- Modify text content
- Add additional form fields
- Change button styles
- Update logo/branding

---

## Troubleshooting

### Issue: Can't login with credentials
**Solution**: Any email and password combination should work. Ensure:
- Email field is not empty
- Password field is not empty
- Email has valid format (contains @)

### Issue: Redirect loop
**Solution**: Clear localStorage and refresh:
```javascript
localStorage.clear();
location.reload();
```

### Issue: Still redirecting to login after successful authentication
**Solution**: Check browser console for errors. Verify:
- AuthProvider wraps entire app
- ProtectedRoute is used correctly
- localStorage is not disabled

### Issue: Logout button not visible
**Solution**: Logout button is only visible:
- On dashboard pages (`/dashboard`, `/admin/dashboard`)
- In the ProfileWidget (right panel)
- At the bottom of the ProfileWidget
- Desktop only (≥1280px)

---

## Next Steps

### Immediate Enhancements
1. **Backend Integration**: Connect to real authentication API
2. **JWT Implementation**: Use tokens instead of user data
3. **Password Reset**: Implement forgot password flow
4. **Sign Up**: Create registration page
5. **Google OAuth**: Integrate Google sign-in

### Future Features
1. **Two-Factor Authentication (2FA)**
2. **Social Login** (Facebook, Twitter, etc.)
3. **Remember Me** functionality
4. **Account Verification** (email verification)
5. **Password Strength Indicator**
6. **Login History** tracking
7. **Session Timeout** with warning
8. **Multiple Device** management

---

## Summary

✅ **Implemented**:
- Pixel-perfect login page
- Protected route system
- Authentication context
- Session persistence
- Logout functionality
- Loading states
- Error handling
- Responsive design

🔧 **Ready for Production**:
- Replace client-side auth with backend API
- Implement JWT tokens
- Add proper password validation
- Enable HTTPS
- Add security headers
- Implement rate limiting

📚 **Documentation**:
- Complete authentication flow
- Security recommendations
- Testing guidelines
- Customization examples
- Troubleshooting guide

The authentication system is fully functional and ready to use! 🎉
