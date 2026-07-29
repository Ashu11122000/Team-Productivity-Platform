"""
===============================================================================
Authentication Router
===============================================================================

Enterprise FastAPI router responsible for exposing all Authentication REST APIs.

Responsibilities
----------------
• Receive authentication requests
• Validate request payloads
• Authenticate users
• Delegate business logic to AuthService
• Return authentication responses
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
                PostgreSQL

Design Principles
-----------------
• Thin Controller Pattern
• Service Layer Architecture
• Dependency Injection
• Single Responsibility Principle
• OpenAPI First Design
• Enterprise Ready
• Clean Architecture

Business Rules
--------------
This router NEVER contains business logic.

Authentication rules are delegated entirely to:

    • AuthService

The router only coordinates HTTP communication.

Compatible With
---------------
• FastAPI
• SQLAlchemy 2.x
• Pydantic v2
• Python 3.12+
"""

from __future__ import annotations

from fastapi import (
    APIRouter,
    status,
)

from app.api.deps import (
    AuthServiceDep,
    CurrentUser,
)
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
)
from app.schemas.user import UserResponse

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

HTTP_CREATED = status.HTTP_201_CREATED

HTTP_OK = status.HTTP_200_OK

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

AuthenticationResponse = AuthResponse

CurrentUserResponse = UserResponse

# =============================================================================
# End Module Configuration
# =============================================================================

# =============================================================================
# Route Summary Constants
# =============================================================================

REGISTER_USER_SUMMARY = "Register User"

LOGIN_USER_SUMMARY = "Login User"

CURRENT_USER_SUMMARY = "Get Current User"

# =============================================================================
# Response Description Constants
# =============================================================================

REGISTER_RESPONSE = "Successfully registered user."

LOGIN_RESPONSE = "JWT access token generated successfully."

CURRENT_USER_RESPONSE = "Authenticated user information."

# =============================================================================
# Authentication Route Paths
# =============================================================================

REGISTER_PATH = "/register"

LOGIN_PATH = "/login"

CURRENT_USER_PATH = "/me"

# =============================================================================
# Common OpenAPI Responses
# =============================================================================

COMMON_AUTH_RESPONSES = {
    status.HTTP_400_BAD_REQUEST: {
        "description": "Invalid request."
    },
    status.HTTP_401_UNAUTHORIZED: {
        "description": "Authentication failed."
    },
    status.HTTP_403_FORBIDDEN: {
        "description": "Permission denied."
    },
    status.HTTP_422_UNPROCESSABLE_ENTITY: {
        "description": "Validation error."
    },
    status.HTTP_500_INTERNAL_SERVER_ERROR: {
        "description": "Internal server error."
    },
}

# =============================================================================
# Dependency Aliases
# =============================================================================

AuthenticationService = AuthServiceDep

AuthenticatedUser = CurrentUser

# =============================================================================
# Request Model Aliases
# =============================================================================

RegisterPayload = RegisterRequest

LoginPayload = LoginRequest

# =============================================================================
# Response Model Aliases
# =============================================================================

RegisterResponse = AuthenticationResponse

LoginResponse = AuthenticationResponse

MeResponse = CurrentUserResponse

# =============================================================================
# End Authentication Metadata
# =============================================================================
# =============================================================================
# Authentication Endpoints
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
    • Delegate registration to the service layer.
    • Return the newly created user and JWT tokens.

    Business Rules
    --------------
    • User registration is handled entirely by ``AuthService``.
    • Password validation and hashing occur in the service layer.
    • Duplicate email validation is handled by the service layer.
    • The router contains no business logic.

    Parameters
    ----------
    request:
        Registration request payload.

    auth_service:
        Authentication service responsible for business logic.

    Returns
    -------
    RegisterResponse
        Authentication response containing the created user
        and issued access token.
    """
    return auth_service.register(
        request=request,
    )


# =============================================================================
# Login Endpoint
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
    • Delegate authentication to the service layer.
    • Return a JWT access token and authenticated user.

    Business Rules
    --------------
    • Credential verification is performed by ``AuthService``.
    • JWT generation is performed by ``AuthService``.
    • Failed authentication raises the appropriate exception.
    • The router contains no business logic.

    Parameters
    ----------
    request:
        Login request payload.

    auth_service:
        Authentication service responsible for business logic.

    Returns
    -------
    LoginResponse
        Authentication response containing the authenticated
        user and issued JWT token.
    """
    return auth_service.login(
        request=request,
    )


# =============================================================================
# End Authentication Endpoints
# =============================================================================
# =============================================================================
# Current User Endpoint
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

    Responsibilities
    ----------------
    • Authenticate the incoming request.
    • Return the authenticated user's profile.
    • Produce a validated response model.

    Business Rules
    --------------
    • Authentication is performed by the authentication dependency.
    • The router contains no authorization or business logic.
    • The authenticated user is returned as a validated response model.

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
# End Current User Endpoint
# =============================================================================

