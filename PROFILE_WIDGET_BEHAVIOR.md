# Profile Widget Behavior Documentation

## Overview
The Profile Widget (right sidebar panel) has smart visibility controls based on the current page route. This provides an optimal user experience by showing the widget only where it's most relevant and hiding it to maximize screen space on data-intensive pages.

## Visibility Rules

### ✅ **Visible On:**
The Profile Widget is displayed on these pages:

1. **Student Dashboard** (`/dashboard`)
   - Shows user profile with progress ring
   - Calendar widget
   - To-do list
   - Provides quick access to profile page

2. **Admin Dashboard** (`/admin/dashboard`)
   - Shows user profile with progress ring
   - Calendar widget
   - To-do list
   - Provides quick access to profile page

### ❌ **Hidden On:**
The Profile Widget is automatically hidden on these pages:

1. **User Management Page** (`/management/users`)
   - Maximizes screen space for user table
   - Allows better visibility of data
   - More room for filters and search

2. **Profile Page** (`/profile`)
   - Redundant since the entire page is dedicated to profile
   - Provides full-screen profile editing experience

3. **Any Future Management Pages**
   - Follows the same pattern for consistency
   - Provides maximum workspace

## Layout Behavior

### When Profile Widget is **Visible** (/dashboard, /admin/dashboard)

```
┌──────────┬────────────────────┬─────────────┐
│          │                    │             │
│ Sidebar  │   Main Content     │   Profile   │
│          │   (max-w-7xl)      │   Widget    │
│          │                    │             │
└──────────┴────────────────────┴─────────────┘
```

- Main content constrained to `max-w-7xl` (1280px)
- Three-column layout (Sidebar, Content, Profile)
- Balanced spacing and padding
- Profile widget is 320px (w-80)

### When Profile Widget is **Hidden** (/management/users, /profile)

```
┌──────────┬─────────────────────────────────┐
│          │                                 │
│ Sidebar  │   Main Content (max-w-full)    │
│          │                                 │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

- Main content expands to `max-w-full`
- Two-column layout (Sidebar, Content)
- Maximum horizontal space for tables and forms
- Better for data-heavy interfaces

## Responsive Behavior

### Desktop (≥1280px)
- **Dashboard Pages**: Profile widget fixed on right side
- **Management Pages**: Profile widget completely hidden

### Tablet (768px-1279px)
- Profile widget available as overlay (when needed)
- Accessible via profile button (if implemented)
- Default state: Hidden

### Mobile (<768px)
- Profile widget available as overlay (when needed)
- Accessible via profile button (if implemented)
- Default state: Hidden

## Technical Implementation

### Code Location
`/src/app/layout/DashboardLayout.tsx`

### Logic
```typescript
// Determine if profile widget should be shown
const shouldShowProfileWidget = 
  location.pathname === '/dashboard' || 
  location.pathname === '/admin/dashboard';

// Conditional rendering - Desktop
{shouldShowProfileWidget && (
  <div className="hidden xl:block">
    <ProfileWidget />
  </div>
)}

// Dynamic content width
<div className={`mx-auto p-6 lg:p-8 ${
  shouldShowProfileWidget ? 'max-w-7xl' : 'max-w-full'
}`}>
```

### How It Works
1. **Route Detection**: Uses React Router's `useLocation()` hook
2. **Conditional Check**: Compares current pathname against dashboard routes
3. **Component Rendering**: Only renders ProfileWidget when condition is true
4. **Layout Adjustment**: Adjusts main content width dynamically

## Benefits

### 🎯 User Experience
- **Context-Aware**: Shows relevant information only when needed
- **Space Optimization**: Maximizes workspace for data-intensive pages
- **Consistent Layout**: Maintains familiar layout on dashboard pages

### 📊 Data Management Pages
- **Better Visibility**: More horizontal space for tables
- **Improved Readability**: Less crowded interface
- **Easier Navigation**: Focus on primary content

### 🎨 Design Consistency
- **Professional**: Clean, uncluttered interfaces
- **Purposeful**: Every element serves a clear purpose
- **Adaptive**: Layout adapts to content needs

## Future Enhancements

### Recommended Features

1. **User Preference Toggle**
   ```typescript
   // Allow users to toggle profile widget visibility
   const [userPreference, setUserPreference] = useState(true);
   const shouldShow = shouldShowProfileWidget && userPreference;
   ```

2. **Profile Widget Button on Management Pages**
   ```typescript
   // Quick access button when widget is hidden
   {!shouldShowProfileWidget && (
     <button onClick={() => setShowProfile(true)}>
       View Profile
     </button>
   )}
   ```

3. **Customizable Routes**
   ```typescript
   // Configuration array for widget visibility
   const PROFILE_WIDGET_ROUTES = ['/dashboard', '/admin/dashboard'];
   const shouldShow = PROFILE_WIDGET_ROUTES.includes(location.pathname);
   ```

4. **Animation Transitions**
   ```typescript
   // Smooth transitions when toggling
   <div className={`transition-all duration-300 ${
     shouldShowProfileWidget ? 'w-80' : 'w-0'
   }`}>
   ```

## Testing Checklist

- ✅ Profile widget visible on `/dashboard`
- ✅ Profile widget visible on `/admin/dashboard`
- ✅ Profile widget hidden on `/management/users`
- ✅ Profile widget hidden on `/profile`
- ✅ Main content expands when widget is hidden
- ✅ Main content constrained when widget is visible
- ✅ No layout shift or flash when navigating
- ✅ Responsive behavior works on all screen sizes

## Troubleshooting

### Issue: Profile widget not hiding
**Solution**: Check that route pathname matches exactly
```typescript
console.log('Current path:', location.pathname);
console.log('Should show:', shouldShowProfileWidget);
```

### Issue: Layout jumping when navigating
**Solution**: Ensure CSS transitions are applied
```css
.content-area {
  transition: max-width 0.3s ease;
}
```

### Issue: Widget showing on wrong pages
**Solution**: Verify pathname comparison logic
```typescript
// Use exact match for specific routes
const shouldShow = location.pathname === '/dashboard' || 
                   location.pathname === '/admin/dashboard';

// Or use includes() for route patterns
const shouldShow = location.pathname.includes('/dashboard');
```

## Best Practices

1. **Route Consistency**: Always use exact pathname matches for predictable behavior
2. **Layout Testing**: Test on all screen sizes when adding new routes
3. **User Feedback**: Consider adding visual indicators when widget is hidden
4. **Performance**: Conditional rendering prevents unnecessary component mounting
5. **Accessibility**: Ensure keyboard navigation works with or without widget

## Related Documentation

- `/PROJECT_STRUCTURE.md` - Overall project structure
- `/USER_MANAGEMENT_FEATURES.md` - User management page details
- `/CHANGELOG.md` - Version history and changes

## Summary

The Profile Widget's conditional visibility is a thoughtful UX enhancement that:
- Shows the widget where it adds value (dashboard pages)
- Hides it where screen space is more valuable (data pages)
- Automatically adjusts layout for optimal content display
- Maintains consistency and professionalism across the application

This smart behavior ensures users always have the best possible view of their current task while maintaining quick access to profile information when needed.
