# User Management Page - Feature Documentation

## Overview
The User Management page is a comprehensive admin tool for managing all users in the BeLyv LMS system. It provides full CRUD operations, advanced filtering, search capabilities, and detailed user information.

## Access
- **Route**: `/management/users`
- **Navigation**: Sidebar → Management → Users
- **Permission**: Admin users only (recommended)

## Key Features

### 1. Statistics Dashboard
Four key metric cards at the top of the page:
- **Total Users**: Shows total number of registered users with growth percentage
- **Active Users**: Count of currently active users with trend indicator
- **Instructors**: Number of instructor accounts
- **Pending**: Users awaiting approval

### 2. Advanced Search & Filtering

#### Search Bar
- Real-time search functionality
- Search by user name or email
- Instant results as you type
- Clear search button

#### Filter Options
- **Role Filter**: Filter by user role
  - All Roles
  - Student
  - Instructor
  - Admin

- **Status Filter**: Filter by account status
  - All Status
  - Active
  - Inactive
  - Pending

- **Combined Filters**: Use multiple filters simultaneously
- **Clear Filters**: One-click to reset all filters
- **Active Filters Display**: Visual indicators showing current active filters

### 3. User Table

#### Columns
1. **User**: Avatar, name, and email
2. **Role**: Badge showing user role (Admin/Instructor/Student)
3. **Status**: Color-coded status indicator
4. **Courses**: Number of enrolled courses
5. **Join Date**: Account creation date
6. **Actions**: Quick action buttons

#### Features
- Responsive table design
- Hover effects on rows
- Color-coded role badges
- Status indicators with distinct colors:
  - Active: Green (#2B9A66)
  - Inactive: Red (#E63946)
  - Pending: Orange (#F59E0B)

### 4. User Actions

Each user row includes action buttons:
- **Send Email**: Direct email to user
- **Edit**: Modify user information
- **Delete**: Remove user from system
- **More Options**: Additional actions menu

### 5. Pagination

- **Items Per Page**: 8 users per page (configurable)
- **Page Numbers**: Click to navigate to specific page
- **Previous/Next**: Arrow buttons for sequential navigation
- **Results Counter**: Shows current range (e.g., "Showing 1 to 8 of 10 users")
- **Auto-disable**: Buttons disabled when on first/last page

### 6. Add New User

#### Modal Form
- **Full Name**: Text input for user's complete name
- **Email**: Email address validation
- **Role**: Dropdown selection
  - Student
  - Instructor
  - Admin
- **Status**: Account status selection
  - Active
  - Inactive
  - Pending

#### Actions
- **Cancel**: Close modal without saving
- **Add User**: Submit form and create new user

### 7. Export Functionality
- Export user data to various formats
- One-click export button
- Includes all user information

## User Interface

### Design Elements
- Clean, modern interface matching BeLyv LMS theme
- Consistent color scheme:
  - Primary: #4ECDC4 (Teal)
  - Success: #2B9A66 (Green)
  - Danger: #E63946 (Red)
  - Warning: #F59E0B (Orange)
  - Neutral: #6E7191 (Gray)

### Responsive Design
- Desktop: Full table view with all columns
- Tablet: Optimized layout with essential columns
- Mobile: Card-based view (recommended enhancement)

### Interactive Elements
- Hover effects on buttons and table rows
- Smooth transitions and animations
- Loading states (can be enhanced)
- Empty state when no results found

## Technical Implementation

### State Management
- Local state using React hooks
- Filter state management
- Pagination state
- Modal visibility state

### Data Flow
1. Mock data initialization
2. Real-time filtering based on search and filter criteria
3. Pagination calculation
4. Display current page results

### Performance Optimizations
- Filtered results calculated on-demand
- Pagination reduces DOM elements
- Efficient re-rendering with React

## Future Enhancements

### Recommended Features
1. **Bulk Actions**
   - Select multiple users
   - Bulk delete/edit
   - Bulk status change

2. **Advanced Sorting**
   - Sort by any column
   - Multi-column sorting
   - Save sort preferences

3. **User Details Modal**
   - Click user to see full profile
   - Quick edit from modal
   - Activity history

4. **Import Users**
   - CSV import functionality
   - Bulk user creation
   - Template download

5. **Role Management**
   - Custom role creation
   - Permission settings
   - Role assignment

6. **Activity Logs**
   - User login history
   - Course enrollment tracking
   - Action audit trail

7. **Email Integration**
   - Send bulk emails
   - Email templates
   - Automated notifications

8. **Advanced Filters**
   - Date range filters
   - Course enrollment filters
   - Custom field filters

9. **Data Visualization**
   - User growth charts
   - Role distribution pie chart
   - Activity heatmaps

10. **Export Options**
    - CSV export
    - PDF export
    - Excel export
    - Custom field selection

## Usage Examples

### Scenario 1: Find All Inactive Instructors
1. Click on "Status" filter
2. Select "Inactive"
3. Click on "Role" filter
4. Select "Instructor"
5. Results show all inactive instructors

### Scenario 2: Search for Specific User
1. Type user's name or email in search bar
2. Results filter in real-time
3. Click on user row for actions

### Scenario 3: Add New Student
1. Click "Add User" button
2. Fill in form fields
3. Select "Student" as role
4. Select status
5. Click "Add User" to submit

### Scenario 4: Review Pending Approvals
1. Click "Status" filter
2. Select "Pending"
3. Review all pending users
4. Take appropriate action

## Security Considerations

### Access Control
- Restrict access to admin users only
- Role-based permissions
- Action authorization

### Data Protection
- Sensitive data masking
- Secure API calls
- Input validation

### Audit Trail
- Log all user management actions
- Track who made changes
- Timestamp all operations

## Integration Points

### Backend API Endpoints (Recommended)
```
GET    /api/users              - Get all users
GET    /api/users/:id          - Get single user
POST   /api/users              - Create new user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
GET    /api/users/export       - Export users
POST   /api/users/import       - Import users
```

### State Management (For Production)
- Consider Redux/Zustand for global state
- React Query for server state
- Context API for theme/auth

## Accessibility

### ARIA Labels
- Descriptive labels for screen readers
- Keyboard navigation support
- Focus management

### Color Contrast
- WCAG AA compliant color ratios
- Status indicators with text, not just color
- Clear visual hierarchy

## Testing Recommendations

### Unit Tests
- Filter logic
- Search functionality
- Pagination calculations

### Integration Tests
- User creation flow
- Filter combinations
- API interactions

### E2E Tests
- Complete user management workflows
- Search and filter scenarios
- CRUD operations

## Support & Documentation

For additional help or feature requests, please refer to:
- Main project documentation
- Component API documentation
- Backend API documentation
