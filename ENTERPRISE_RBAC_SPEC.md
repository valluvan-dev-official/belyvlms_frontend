# Enterprise RBAC Architecture Specification

**Version:** 1.0.0  
**Status:** APPROVED  
**Scope:** Entire Platform (Starting with Permission Library & Access Control)

---

## 1. Executive Summary
We are standardizing our RBAC (Role-Based Access Control) system to follow a **Granular, CRUD-based Enterprise Model**. This document defines the strict architectural principles, API contracts, and database schema requirements that must be adhered to without exception.

**Goal:** Eliminate permission ambiguity, ensure strict security boundaries, and provide a scalable foundation for future modules.

---

## 2. Core Architectural Principles (Non-Negotiable)

1.  **Business Capability Focus**: Permissions represent *what a user can do* (Business Capability), not *what they can see* (UI Screen).
2.  **View vs. Mutation Separation**:
    *   **VIEW**: Allows screen visibility and read-only data fetching.
    *   **MUTATION (Create/Update/Delete)**: Controls actions only.
    *   *Critical Rule*: Mutation permissions **NEVER** imply View permission. A user with `CREATE` but not `VIEW` cannot see the list.
3.  **Destructive Isolation**: `DELETE` actions must always have their own isolated permission.
4.  **1:1 API Mapping**: Every API endpoint must enforce **EXACTLY ONE** specific permission check.
5.  **No "God" Permissions**: No generic `MANAGE_ALL` or overloaded permissions allowed.

---

## 3. Module Specifications

### 3.1 Permission Library Module (New Enterprise Standard)

**Target Module:** `Permission Library`

| Permission Code | Name | Description / Semantics |
| :--- | :--- | :--- |
| **`PERMISSION_LIBRARY_VIEW`** | View Library | Allows viewing the Permission Library and reading all permission definitions. Does NOT allow creating, editing, or deleting. |
| **`PERMISSION_LIBRARY_CREATE`** | Create Permission | Allows creating new permission definitions. |
| **`PERMISSION_LIBRARY_UPDATE`** | Update Permission | Allows editing existing permission definitions. Does NOT allow deletion. |
| **`PERMISSION_LIBRARY_DELETE`** | Delete Permission | Allows deleting permission definitions. This is a destructive action. |

### 3.2 Access Control Module (Consistency Update)

**Target Module:** `Matrix View` & `Role Management`

| Permission Code | Name | Description |
| :--- | :--- | :--- |
| **`ACCESS_CONTROL_MATRIX_VIEW`** | View Matrix | Can see the Permission Matrix (Read-Only). |
| **`ACCESS_CONTROL_MATRIX_EDIT`** | Edit Matrix | Can toggle checkboxes and save matrix changes. |
| **`ROLE_VIEW`** | View Roles | Role Management screen visible. Role list fetched (read-only). |
| **`ROLE_CREATE`** | Create Role | Allows creating new roles. |
| **`ROLE_UPDATE`** | Update Role | Allows updating existing roles. |
| **`ROLE_DELETE`** | Delete Role | Allows deleting roles. |

---

## 4. API Authorization Rules (Critical)

**Enforcement Strategy:**
Every endpoint must have a `@RequiresPermission('CODE')` annotation (or equivalent middleware) enforcing strict 1:1 mapping.

#### Permission Library API
*   `GET /api/rbac/permissions/` $\rightarrow$ **`PERMISSION_LIBRARY_VIEW`**
*   `POST /api/rbac/permissions/` $\rightarrow$ **`PERMISSION_LIBRARY_CREATE`**
*   `PUT /api/rbac/permissions/{id}` $\rightarrow$ **`PERMISSION_LIBRARY_UPDATE`**
*   `DELETE /api/rbac/permissions/{id}` $\rightarrow$ **`PERMISSION_LIBRARY_DELETE`**

#### Role Management API
*   `GET /api/rbac/roles/` $\rightarrow$ **`ROLE_VIEW`**
*   `POST /api/rbac/roles/` $\rightarrow$ **`ROLE_CREATE`**
*   `PUT /api/rbac/roles/{id}` $\rightarrow$ **`ROLE_UPDATE`**
*   `DELETE /api/rbac/roles/{id}` $\rightarrow$ **`ROLE_DELETE`**

**Forbidden Patterns:**
*   $\times$ Using `UPDATE` permission to allow `DELETE` operations.
*   $\times$ Using `CREATE` permission to allow `VIEW` (fetching lists).
*   $\times$ Hardcoding `if (user.role === 'Admin')` checks in code.

---

## 5. Database Implementation & Migration

### 5.1 Schema Requirements
1.  **Unique Constraint**: The `code` column in the `permissions` table must be UNIQUE.
2.  **Immutability**: Permission codes should not change once defined.

### 5.2 Seeding Strategy (Role Assignments)

| Role | Permission Library Access | Role Management Access | Notes |
| :--- | :--- | :--- | :--- |
| **Super Admin** | **ALL** (View, Create, Update, Delete) | **ALL** (View, Create, Update, Delete) | Full System Control |
| **Admin** | **NONE** (Default) | **NONE** (Default) | Must be explicitly assigned by Super Admin. |
| **Trainer** | NONE | NONE | Restricted |
| **Student** | NONE | NONE | Restricted |

### 5.3 Deprecation Plan
1.  **Mark Deprecated**:
    *   `ACCESS_CONTROL_PERMISSION_VIEW`
    *   `ACCESS_CONTROL_ROLE_VIEW` / `_CREATE` / `_DELETE`
2.  **Remove Assignments**: Remove these deprecated permissions from all *new* role assignments immediately.
3.  **Cleanup**: Once frontend deployment is confirmed, delete deprecated rows from `permissions` table.

---

## 6. API Response Contract

The `GET /permissions` endpoint must return data matching this structure for the Frontend Matrix:

```json
[
  {
    "code": "PERMISSION_LIBRARY_VIEW",
    "module": "Permission Library",
    "name": "View Library",
    "description": "Allows viewing the Permission Library and reading all permission definitions..."
  },
  ...
]
```

---

## 7. Success Criteria
*   [ ] **Contract Clarity**: Every API endpoint has exactly one clear permission requirement.
*   [ ] **Zero Ambiguity**: "Update" never means "Delete". "View" never means "Edit".
*   [ ] **Frontend Sync**: Frontend tooltips and Matrix UI match Backend definitions 100%.
*   [ ] **Security**: Admin role has zero implicit access to these sensitive modules.

---
**Approved By:** Senior Backend Architect  
**Date:** 2026-01-31
