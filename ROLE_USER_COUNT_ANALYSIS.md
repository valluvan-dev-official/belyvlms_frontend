# Role User Count Mismatch Analysis

## 1. Issue Description
There is a discrepancy between the user data found in the `api/profiles/users/` endpoint and the "User Count" displayed in the Access Control Role Management page (fetched from `rbac/roles/`).

- **Observed Behavior**: The Access Control page shows **0 users** for roles like "Trainer".
- **Actual Data**: The User Profiles API (`api/profiles/users/`) shows users clearly assigned to the "trainer" role.

## 2. Technical Root Cause
The issue stems from how the data is fetched and structured in the Backend APIs. The Frontend application treats these two endpoints as separate sources of truth.

### A. How Frontend Fetches Role Data (Current Implementation)
The Access Control page calls the **RBAC API**:
`GET /rbac/roles/`

The frontend expects a response structure like this to display the count:
```json
[
  {
    "id": 1,
    "name": "Trainer",
    "code": "TRN",
    "user_count": 5,  <-- Frontend looks for this field
    "color": "#F4A261"
  }
]
```
**Current State**: It appears the `rbac/roles/` endpoint is either:
1. **Not returning** the `user_count` field at all (so Frontend defaults to 0).
2. **Returning 0**, because the backend logic for this specific endpoint is not calculating the active users.

### B. User Data Disconnect
You observed user data in a different API:
`GET /api/profiles/users/`
```json
{
    "id": 824,
    "role": "trainer",  <-- String value "trainer"
    ...
}
```

**The Mismatch**:
The **RBAC System** (Role Management) and the **User Profile System** seem to be loosely coupled in the backend.
- The Users table uses a simple string `"trainer"` to denote a role.
- The RBAC Roles table might use an ID or a Code (e.g., `"TRN"`).
- Unless the Backend explicitly links these two tables and performs a count query (e.g., `SELECT COUNT(*) FROM users WHERE role = 'trainer'`) when the `/rbac/roles/` endpoint is hit, the count will remain 0.

## 3. Is this a mistake?
**Yes, but it is a Backend Logic gap, not a Frontend bug.**

The Frontend is correctly visualizing the data it receives from the Role API. Since the Role API says "0 users" (or omits the count), the Frontend displays "0 users".

## 4. Required Fix (Backend Side)
To fix this, the backend developer needs to update the `GET /rbac/roles/` endpoint to:
1. **Query the Users table** to count how many users have each role.
2. **Map the role strings** (e.g., "trainer") to the RBAC Role objects.
3. **Include the count** in the `user_count` field of the response.

No changes are required in the Frontend code if the Backend updates the API response to include the correct count.
