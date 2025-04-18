# User Management API

This API serves as a digital tool for managing user accounts within a system.

## User Roles

The system has two main user types:

- **Administrators**  
  Have full control with capabilities to:
  - Create new user accounts
  - View any user's information
  - Modify any user's details
  - Delete user accounts

- **Regular Users**  
  Have limited access with permissions to:
  - View their own account information
  - Update their personal details (name, password)
  - Cannot modify sensitive fields (user type, email)
  - Cannot access other users' accounts

## Authentication Flow

1. **Login**  
   Users must first authenticate by logging in.

2. **Token Generation**  
   Upon successful login, the API returns a JWT (JSON Web Token).

3. **Token Usage**  
   This token must be included in all subsequent API requests (except login) as an authorization credential.

## Security Model

- The token acts as an access key that:
  - Identifies the user
  - Determines permission levels
  - Is required for all protected operations
    - Viewing user information
    - Updating account details
    - Admin-specific functions (for administrators)