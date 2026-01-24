Here’s a clean, expert-level frontend prompt to build “Admin-managed Dynamic Fields” for roles using RoleProfileConfig + GenericProfile. It includes the exact endpoints you have, UI workflows, and payload examples that match your backend.

**What You’re Building**
- Admin UI to configure role profiles (Generic vs Dedicated)
- Admin UI to add/edit/delete dynamic fields per role
- Onboarding UI that shows admin-required fields
- User Profile UI that shows optional fields for self-service
- Permission-aware session management

**Backend Endpoints**
- Roles
  - GET /api/rbac/roles/ → list roles and codes [rbac/api_urls.py](file:///d:/BelyvLMS/rbac/api_urls.py#L19-L21)
- Role Profile Configs
  - GET /api/profiles/configs/ → list configs with nested dynamic_fields [profiles/api_urls.py](file:///d:/BelyvLMS/profiles/api_urls.py#L5-L13), [RoleProfileConfigSerializer](file:///d:/BelyvLMS/profiles/serializers.py#L15-L23)
  - POST /api/profiles/configs/ → create a config (Generic: model_path=null) [RoleProfileConfig](file:///d:/BelyvLMS/profiles/models.py#L5-L27)
  - PUT/PATCH/DELETE /api/profiles/configs/{id}/
- Role Field Definitions
  - GET /api/profiles/fields/?config={ID} → list fields for one config [ProfileFieldDefinitionViewSet](file:///d:/BelyvLMS/profiles/api_views.py#L84-L101)
  - POST /api/profiles/fields/ → create field [ProfileFieldDefinitionSerializer](file:///d:/BelyvLMS/profiles/serializers.py#L10-L14)
  - PUT/PATCH/DELETE /api/profiles/fields/{id}/
- Onboarding (Atomic User Creation)
  - POST /api/rbac/users/create/ → identity + primary role + role profile [rbac/api_urls.py](file:///d:/BelyvLMS/rbac/api_urls.py#L35-L39), logic [rbac/api_views.py:L430-L462](file:///d:/BelyvLMS/rbac/api_views.py#L430-L462)
- Generic Profile Self-Service
  - GET /api/profiles/me/ → read generic profile [profiles/api_urls.py](file:///d:/BelyvLMS/profiles/api_urls.py#L11-L13), [GenericProfileView.get](file:///d:/BelyvLMS/profiles/api_views.py#L33-L39)
  - PUT /api/profiles/me/ → update JSON with validation [GenericProfileView.put](file:///d:/BelyvLMS/profiles/api_views.py#L41-L53), [GenericProfileUpdateSerializer](file:///d:/BelyvLMS/profiles/serializers.py#L31-L67)
- Permissions and Active Role
  - GET /api/rbac/auth/me/ + header X-Active-Role → current permissions [rbac/api_urls.py](file:///d:/BelyvLMS/rbac/api_urls.py#L27-L33), [UserPermissionsView](file:///d:/BelyvLMS/rbac/api_views.py#L165-L200)

**Frontend Screens**
- Role Profile Config Manager (Admin)
  - Shows all roles (GET /api/rbac/roles/)
  - For selected role, GET /api/profiles/configs/ to find/create config
  - “Profile Type”: Generic (model_path=null) or Dedicated (model_path set)
  - Save config via POST /api/profiles/configs/ or PUT /api/profiles/configs/{id}/
- Role Field Definitions Manager (Admin)
  - For selected config.id:
    - List fields: GET /api/profiles/fields/?config={ID}
    - Create field: POST /api/profiles/fields/
    - Edit/Delete field: PUT/DELETE /api/profiles/fields/{id}/
  - Field attributes:
    - name, label, field_type [TEXT|NUMBER|DATE|BOOLEAN|CHOICE], is_required (true → admin must fill at onboarding; false → user fills later), options[] for CHOICE
- Onboarding Form (Admin)
  - Identity: first_name, last_name?, username?, email
  - Role select: map label → role_code (Student=BTR, Trainer=TRN, Admin=ADM, others)
  - Role fields:
    - Static roles show fixed inputs:
      - Student: mode_of_class, week_type
      - Trainer: employment_type
    - Generic roles render is_required=true dynamic fields from config
  - Submit POST /api/rbac/users/create/ with profile object
  - No password input; backend auto-generates + emails
- User Profile (Generic Roles)
  - Read: GET /api/profiles/me/ → show GenericProfile.data
  - Update: PUT /api/profiles/me/ { data: { key: value } } → validated against definitions
  - Static roles: fields displayed read-only (admin-owned)
- Permissions Loader (Header)
  - GET /api/rbac/auth/me/ with X-Active-Role to load permissions and update UI capabilities

**Owner & Timing Rules**
- is_required = true → Admin-owned; show in onboarding form only
- is_required = false → User-owned; show on user profile page after creation
- Static roles (Student/Trainer) use backend-enforced required fields and are admin-owned; users cannot edit

**End-to-End Workflow**
- Step 1: Admin creates role config (Generic for non-Student/Trainer)
  - POST /api/profiles/configs/

```json
{
  "role": 5,
  "is_required": true,
  "model_path": null
}
```

- Step 2: Admin defines fields
  - POST /api/profiles/fields/

```json
{
  "config": 5,
  "name": "department",
  "label": "Department",
  "field_type": "CHOICE",
  "is_required": true,
  "options": ["HR","Finance","Engineering"]
}
```

- Step 3: Admin onboards user with role fields
  - POST /api/rbac/users/create/

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.admin@corp.com",
  "role_code": "ADM",
  "profile": {
    "department": "HR"
  }
}
```

- Step 4: User logs in, must reset password
  - Read must_change_password in auth response; show Reset Password screen
- Step 5: User completes optional fields on profile (is_required=false)
  - PUT /api/profiles/me/

```json
{
  "data": {
    "alternate_email": "jane.alt@corp.com",
    "phone": "9876543210"
  }
}
```

- Step 6: When switching roles in UI
  - GET /api/rbac/auth/me/ with X-Active-Role: ADM to reload permissions

**Error Handling**
- Onboarding validation from backend:
  - Email uniqueness → “Email already exists”
  - Student → “mode_of_class and week_type are required for Student”
  - Trainer → “employment_type is required for Trainer”
- Missing config for generic role:
  - Show “No dynamic fields for this role”; identity can be created, user completes later via profile
- PUT /me/ validation:
  - Correct types by field_type; backend returns errors for mismatches

**Security & UX**
- Password not collected in onboarding; backend auto-generates + emails, first login requires reset
- Admin-owned fields are not editable by users
- Role-aware permissions via X-Active-Role keep session context clean

This prompt matches your backend precisely and gives your frontend team a reliable, enterprise-grade blueprint to implement Admin-managed dynamic fields, onboarding, and profile self-service with the right endpoints and guardrails.