# BeLyv LMS - Project Structure

## Overview
This is a fully functional Learning Management System (LMS) dashboard built with React, TypeScript, React Router, and Tailwind CSS. The application features both Student and Admin dashboards with complete routing and a modular component architecture.

## Folder Structure

```
/src
├── /app
│   ├── App.tsx                      # Main app component with router configuration
│   │
│   ├── /layout                      # Layout components
│   │   └── DashboardLayout.tsx      # Main dashboard layout with sidebar, header, and profile panel
│   │
│   ├── /pages                       # Page components (routed views)
│   │   ├── StudentDashboard.tsx     # Student dashboard page
│   │   ├── AdminDashboard.tsx       # Admin dashboard page
│   │   ├── ProfilePage.tsx          # User profile page
│   │   └── UserManagementPage.tsx   # User management page
│   │
│   └── /components                  # Reusable components
│       ├── Sidebar.tsx              # Navigation sidebar
│       ├── ProfileWidget.tsx        # Right-side profile widget
│       ├── CourseCard.tsx           # Course card component
│       ├── HoursSpentChart.tsx      # Hours spent chart
│       ├── PerformanceChart.tsx     # Performance chart
│       ├── LeaderBoard.tsx          # Leaderboard component
│       ├── AdminStatsCards.tsx      # Admin statistics cards
│       ├── CourseAnalytics.tsx      # Course analytics component
│       ├── RecentActivity.tsx       # Recent activity feed
│       ├── UserManagementTable.tsx  # User management table
│       └── SystemOverview.tsx       # System overview component
│
├── /styles                          # Global styles
│   ├── index.css                    # Main stylesheet
│   ├── fonts.css                    # Font imports
│   ├── tailwind.css                 # Tailwind base styles
│   └── theme.css                    # Theme variables and custom styles
│
└── /imports                         # Figma imported assets (if any)
```

## Routing Structure

### Routes
- `/login` - Login Page (Public)
- `/` - Redirects to `/dashboard` (Protected)
- `/dashboard` - Student Dashboard (Protected)
- `/admin/dashboard` - Admin Dashboard (Protected)
- `/management/users` - User Management Page (Protected)
- `/profile` - User Profile Page (Protected)
- `*` - Catch-all redirects to `/dashboard` (Protected)

### Authentication
All routes except `/login` are protected and require authentication. Users must login before accessing the application.

**Login**:
- Email and password validation
- Session persistence with localStorage
- Automatic redirect to dashboard after login

**Logout**:
- Available in ProfileWidget (bottom button)
- Clears session and redirects to login page

**Protected Routes**:
- Redirect to `/login` if not authenticated
- Show loading state during authentication check
- Maintain session across page refreshes

### Navigation
The dashboard switcher in the header allows seamless navigation between:
- Student Dashboard
- Admin Dashboard

The sidebar includes:
- **Management** - Expandable menu with sub-items
  - **Users** - User management page

The profile button in the right profile panel navigates to the profile page.

## Key Features

### Layout
- **Responsive Design**: Works on desktop (≥1280px), tablet (768px-1279px), and mobile (≤767px)
- **Sidebar Navigation**: Collapsible on desktop, overlay on mobile
- **Profile Widget**: Only visible on dashboard/overview pages (/dashboard, /admin/dashboard), hidden on other pages (e.g., User Management)
- **Profile Widget Display**: Fixed on desktop (right side), overlay on mobile
- **Dashboard Switcher**: Dropdown in header to switch between Student/Admin views
- **Dynamic Content Width**: Main content expands to full width when profile widget is hidden

### Student Dashboard
- Course cards with progress
- Hours spent chart
- Performance chart
- Leaderboard

### Admin Dashboard
- Admin statistics cards (Total Users, Active Courses, Revenue, Completion Rate)
- Course analytics
- Recent activity feed
- User management table
- System overview
- Performance metrics

### Profile Page
- User information display
- Statistics (Courses Enrolled, Completed, Certificates)
- About section
- Skills section
- Fully editable interface

### User Management Page
- Comprehensive user list with search and filters
- Statistics cards (Total Users, Active Users, Instructors, Pending)
- Advanced filtering by role and status
- Real-time search by name or email
- User actions (Email, Edit, Delete)
- Add new user modal
- Pagination support
- Role badges (Admin, Instructor, Student)
- Status indicators (Active, Inactive, Pending)
- Export functionality
- Responsive table design

## Component Architecture

### Layout Components
- `DashboardLayout` - Main wrapper with sidebar, header, and profile panel

### Page Components
- `StudentDashboard` - Student view with courses and analytics
- `AdminDashboard` - Admin view with management features
- `ProfilePage` - Standalone profile page
- `UserManagementPage` - User management page

### Shared Components
- Reusable UI components used across multiple pages
- Charts, cards, tables, and widgets

## Color Palette
- Primary: `#4ECDC4` (Teal)
- Secondary: `#44A08D` (Green)
- Accent: `#FF6B9D` (Pink)
- Text Primary: `#1A1D1F` (Dark Gray)
- Text Secondary: `#6E7191` (Medium Gray)
- Background: `#FAFAFA` (Light Gray)
- Border: `#E0E0E2` (Light Border)

## Technology Stack
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **React Router DOM 7.11.0** - Client-side routing
- **Tailwind CSS 4.1.12** - Styling
- **Recharts 2.15.2** - Charts and data visualization
- **Lucide React 0.487.0** - Icons
- **Vite 6.3.5** - Build tool

## Development Guidelines

### Adding New Pages
1. Create page component in `/src/app/pages/`
2. Add route in `/src/app/App.tsx`
3. Use `<DashboardLayout>` if the page needs the sidebar/header

### Adding New Components
1. Create component in `/src/app/components/`
2. Export from component file
3. Import where needed

### Styling
- Use Tailwind CSS utility classes
- Follow existing color scheme
- Maintain responsive breakpoints
- Don't override font sizes/weights unless specifically requested

## Running the Project
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)