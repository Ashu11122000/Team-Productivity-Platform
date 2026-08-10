"""
===============================================================================
Enterprise Team Productivity Platform
FastAPI Backend

Module: app.api.routes.auth

Architecture:
    Clean Architecture
    Thin Controller Pattern
    Service Layer Pattern
    Repository Pattern

Python:
    3.12+

Framework:
    FastAPI

Database:
    PostgreSQL

ORM:
    SQLAlchemy 2.x

Validation:
    Pydantic v2
===============================================================================

Overview
--------
Enterprise FastAPI router responsible for exposing all Authentication REST
APIs.

The router represents the HTTP presentation layer between API clients and
AuthService.

The router intentionally contains no authentication or authorization
business logic.

Responsibilities
----------------
• Receive authentication requests
• Validate request payloads
• Authenticate users through dependencies
• Delegate authentication operations to AuthService
• Return response DTOs
• Define HTTP status codes
• Generate OpenAPI documentation

Architecture
------------

                HTTP Request
                     │
                     ▼
           Authentication Router
                     │
                     ▼
                AuthService
                     │
                     ▼
               UserRepository
                     │
                     ▼
                SQLAlchemy ORM
                     │
                     ▼
                PostgreSQL

Router Responsibilities
------------------------
• HTTP transport
• Request validation
• Dependency injection
• Authentication dependencies
• Response serialization
• OpenAPI metadata
• HTTP status codes

AuthService Responsibilities
----------------------------
• User registration
• User authentication
• Credential validation
• Password hashing
• Password verification
• Password changes
• JWT generation
• Token renewal
• Current-user validation
• Active-account validation
• Administrator validation
• Logout workflow

Repository Responsibilities
----------------------------
• User persistence
• User lookup
• Email lookup
• CRUD operations
• Database transactions

Business Rules
--------------
This router NEVER contains business logic.

Authentication rules are delegated entirely to:

    app.services.auth_service.AuthService

The router only coordinates HTTP communication.

Microservice Responsibilities
------------------------------
FastAPI owns:

• Authentication
• Authorization
• JWT generation
• Refresh/token renewal
• Users
• Notes
• Open Library Integration

NestJS owns:

• Tasks
• Categories
• Tags
• Notifications
• Analytics
• Dashboard
• Activity Logs

Authentication must remain exclusively owned by FastAPI.

Design Principles
-----------------
• Thin Controller Pattern
• Service Layer Architecture
• Dependency Injection
• Single Responsibility Principle
• OpenAPI First Design
• Clean Architecture
• Explicit typing
• Centralized business logic
• Enterprise Ready

Security
--------
The router does not directly perform:

• Password hashing
• Password verification
• JWT creation
• JWT validation
• Role validation
• Account activation validation
• Credential validation

These responsibilities belong to AuthService and authentication
dependencies.

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• Pydantic v2
• PostgreSQL
• Python 3.12+

===============================================================================
"""

from __future__ import annotations

# =============================================================================
# Standard Library Imports
# =============================================================================

from typing import TypeAlias

# =============================================================================
# Third-Party Imports
# =============================================================================

from fastapi import (
    APIRouter,
    status,
)

# =============================================================================
# Application Dependencies
# =============================================================================

from app.api.deps import (
    AuthServiceDep,
    CurrentUser,
)

# =============================================================================
# Schema Imports
# =============================================================================

from app.schemas.auth import (
    AuthResponse,
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
)

from app.schemas.user import UserResponse

# =============================================================================
# Public Module Exports
# =============================================================================

__all__ = [
    "router",
]

# =============================================================================
# Module Constants
# =============================================================================

ROUTER_PREFIX: str = "/auth"

AUTH_TAG: str = "Authentication"

# =============================================================================
# HTTP Status Codes
# =============================================================================

HTTP_CREATED: int = status.HTTP_201_CREATED

HTTP_OK: int = status.HTTP_200_OK

# =============================================================================
# Router Configuration
# =============================================================================

router = APIRouter(
    prefix=ROUTER_PREFIX,
    tags=[AUTH_TAG],
)

# =============================================================================
# Type Aliases
# =============================================================================

AuthenticationResponse: TypeAlias = AuthResponse

CurrentUserResponse: TypeAlias = UserResponse

AuthenticationService: TypeAlias = AuthServiceDep

AuthenticatedUser: TypeAlias = CurrentUser

RegisterPayload: TypeAlias = RegisterRequest

LoginPayload: TypeAlias = LoginRequest

PasswordChangePayload: TypeAlias = ChangePasswordRequest

RegisterResponse: TypeAlias = AuthenticationResponse

LoginResponse: TypeAlias = AuthenticationResponse

RefreshResponse: TypeAlias = AuthenticationResponse

MeResponse: TypeAlias = CurrentUserResponse

ChangePasswordResponse: TypeAlias = UserResponse

LogoutResponse: TypeAlias = dict[str, str]

# =============================================================================
# Authentication Route Paths
# =============================================================================

REGISTER_PATH: str = "/register"

LOGIN_PATH: str = "/login"

CURRENT_USER_PATH: str = "/me"

REFRESH_PATH: str = "/refresh"

CHANGE_PASSWORD_PATH: str = "/change-password"

LOGOUT_PATH: str = "/logout"

# =============================================================================
# Route Summary Constants
# =============================================================================

REGISTER_USER_SUMMARY: str = "Register User"

LOGIN_USER_SUMMARY: str = "Login User"

CURRENT_USER_SUMMARY: str = "Get Current User"

REFRESH_TOKEN_SUMMARY: str = "Refresh Access Token"

CHANGE_PASSWORD_SUMMARY: str = "Change Password"

LOGOUT_USER_SUMMARY: str = "Logout User"

# =============================================================================
# Response Description Constants
# =============================================================================

REGISTER_RESPONSE: str = (
    "Successfully registered user."
)

LOGIN_RESPONSE: str = (
    "JWT access token generated successfully."
)

CURRENT_USER_RESPONSE: str = (
    "Authenticated user information."
)

REFRESH_RESPONSE: str = (
    "New JWT access token generated successfully."
)

CHANGE_PASSWORD_RESPONSE: str = (
    "Password changed successfully."
)

LOGOUT_RESPONSE: str = (
    "User logout confirmation."
)

# =============================================================================
# Common OpenAPI Responses
# =============================================================================

COMMON_AUTH_RESPONSES = {
    status.HTTP_400_BAD_REQUEST: {
        "description": "Invalid request.",
    },
    status.HTTP_401_UNAUTHORIZED: {
        "description": "Authentication failed.",
    },
    status.HTTP_403_FORBIDDEN: {
        "description": "Permission denied.",
    },
    status.HTTP_404_NOT_FOUND: {
        "description": "User not found.",
    },
    status.HTTP_409_CONFLICT: {
        "description": "Resource conflict.",
    },
    status.HTTP_422_UNPROCESSABLE_ENTITY: {
        "description": "Validation error.",
    },
    status.HTTP_500_INTERNAL_SERVER_ERROR: {
        "description": "Internal server error.",
    },
}

# =============================================================================
# End Module Configuration
# =============================================================================


# =============================================================================
# Register User
# =============================================================================

@router.post(
    REGISTER_PATH,
    response_model=RegisterResponse,
    status_code=HTTP_CREATED,
    summary=REGISTER_USER_SUMMARY,
    response_description=REGISTER_RESPONSE,
    responses=COMMON_AUTH_RESPONSES,
)
def register_api(
    request: RegisterPayload,
    auth_service: AuthenticationService,
) -> RegisterResponse:
    """
    Register a new user account.

    Responsibilities
    ----------------
    • Validate the registration payload.
    • Delegate registration to AuthService.
    • Return the created user.
    • Return the generated JWT access token.

    Business Rules
    --------------
    • Registration is handled by AuthService.
    • Password hashing is handled by AuthService.
    • Duplicate email validation is handled by AuthService.
    • Default role assignment is handled by AuthService.
    • JWT generation is handled by AuthService.
    • The router contains no business logic.

    Parameters
    ----------
    request:
        Registration request payload.

    auth_service:
        Authentication service.

    Returns
    -------
    RegisterResponse
        Authentication response containing the created user
        and issued JWT access token.
    """
    return auth_service.register(
        request=request,
    )


# =============================================================================
# Login User
# =============================================================================

@router.post(
    LOGIN_PATH,
    response_model=LoginResponse,
    status_code=HTTP_OK,
    summary=LOGIN_USER_SUMMARY,
    response_description=LOGIN_RESPONSE,
    responses=COMMON_AUTH_RESPONSES,
)
def login_api(
    request: LoginPayload,
    auth_service: AuthenticationService,
) -> LoginResponse:
    """
    Authenticate an existing user.

    Responsibilities
    ----------------
    • Validate the login payload.
    • Delegate credential validation to AuthService.
    • Return the generated JWT access token.
    • Return the authenticated user.

    Business Rules
    --------------
    • Credential verification is handled by AuthService.
    • Password verification is handled by AuthService.
    • Active-account validation is handled by AuthService.
    • JWT generation is handled by AuthService.
    • Failed authentication is handled by AuthService.
    • The router contains no business logic.

    Parameters
    ----------
    request:
        Login request payload.

    auth_service:
        Authentication service.

    Returns
    -------
    LoginResponse
        Authentication response containing the authenticated
        user and issued JWT access token.
    """
    return auth_service.login(
        request=request,
    )


# =============================================================================
# Current User
# =============================================================================

@router.get(
    CURRENT_USER_PATH,
    response_model=MeResponse,
    status_code=HTTP_OK,
    summary=CURRENT_USER_SUMMARY,
    response_description=CURRENT_USER_RESPONSE,
    responses=COMMON_AUTH_RESPONSES,
)
def get_current_user_api(
    current_user: AuthenticatedUser,
) -> MeResponse:
    """
    Retrieve the currently authenticated user.

    Authentication is performed by the authentication dependency.

    Responsibilities
    ----------------
    • Authenticate the incoming request.
    • Receive the authenticated user.
    • Convert the ORM model into UserResponse.
    • Return the authenticated user's profile.

    Parameters
    ----------
    current_user:
        Authenticated user injected by the authentication dependency.

    Returns
    -------
    MeResponse
        Profile of the currently authenticated user.
    """
    return MeResponse.model_validate(
        current_user,
    )


# =============================================================================
# Refresh Access Token
# =============================================================================

@router.post(
    REFRESH_PATH,
    response_model=RefreshResponse,
    status_code=HTTP_OK,
    summary=REFRESH_TOKEN_SUMMARY,
    response_description=REFRESH_RESPONSE,
    responses=COMMON_AUTH_RESPONSES,
)
def refresh_access_token_api(
    current_user: AuthenticatedUser,
    auth_service: AuthenticationService,
) -> RefreshResponse:
    """
    Generate a new JWT access token.

    Responsibilities
    ----------------
    • Authenticate the current user.
    • Delegate token generation to AuthService.
    • Return the new authentication response.

    Business Rules
    --------------
    • Only active users may renew their access token.
    • JWT generation is handled by AuthService.
    • The router contains no token-generation logic.

    Parameters
    ----------
    current_user:
        Authenticated user.

    auth_service:
        Authentication service.

    Returns
    -------
    RefreshResponse
        Authentication response containing the newly generated
        JWT access token.
    """
    return auth_service.refresh_access_token(
        current_user=current_user,
    )


# =============================================================================
# Change Password
# =============================================================================

@router.post(
    CHANGE_PASSWORD_PATH,
    response_model=ChangePasswordResponse,
    status_code=HTTP_OK,
    summary=CHANGE_PASSWORD_SUMMARY,
    response_description=CHANGE_PASSWORD_RESPONSE,
    responses=COMMON_AUTH_RESPONSES,
)
def change_password_api(
    request: PasswordChangePayload,
    current_user: AuthenticatedUser,
    auth_service: AuthenticationService,
) -> ChangePasswordResponse:
    """
    Change the authenticated user's password.

    Responsibilities
    ----------------
    • Validate the password-change payload.
    • Authenticate the current user.
    • Delegate password-change logic to AuthService.
    • Return the updated user.

    Business Rules
    --------------
    • Current-password verification is handled by AuthService.
    • New-password validation is handled by AuthService.
    • Password hashing is handled by AuthService.
    • Persistence is delegated through the repository layer.
    • The router contains no password business logic.

    Parameters
    ----------
    request:
        Password change request.

    current_user:
        Authenticated user.

    auth_service:
        Authentication service.

    Returns
    -------
    ChangePasswordResponse
        Updated user profile.
    """
    return auth_service.change_password(
        user=current_user,
        request=request,
    )


# =============================================================================
# Logout
# =============================================================================

@router.post(
    LOGOUT_PATH,
    response_model=LogoutResponse,
    status_code=HTTP_OK,
    summary=LOGOUT_USER_SUMMARY,
    response_description=LOGOUT_RESPONSE,
    responses=COMMON_AUTH_RESPONSES,
)
def logout_api(
    current_user: AuthenticatedUser,
    auth_service: AuthenticationService,
) -> LogoutResponse:
    """
    Logout the currently authenticated user.

    JWT authentication is stateless in the current implementation.
    AuthService therefore returns a logout confirmation and the client is
    responsible for discarding the access token.

    Future token-revocation functionality can be implemented inside
    AuthService without changing this router's responsibility.

    Responsibilities
    ----------------
    • Authenticate the current user.
    • Delegate logout handling to AuthService.
    • Return logout confirmation.

    Business Rules
    --------------
    • Logout logic belongs to AuthService.
    • Token revocation is not implemented here.
    • The router contains no authentication state management.

    Parameters
    ----------
    current_user:
        Authenticated user.

    auth_service:
        Authentication service.

    Returns
    -------
    LogoutResponse
        Logout confirmation message.
    """
    return auth_service.logout(
        user=current_user,
    )


# =============================================================================
# End Authentication Router
# =============================================================================