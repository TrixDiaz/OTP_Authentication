# FastLink Server API Documentation

## OTP-Based Authentication System

This server implements a secure OTP (One-Time Password) based authentication system using email verification.

### Authentication Flow

#### 1. Registration Process

1. **Send Registration OTP**: User provides email, system sends 6-digit OTP
2. **Verify OTP**: User enters OTP, account is created and verified
3. **Complete Profile**: User sets name, password, and PIN

#### 2. Login Process

1. **Send Login OTP**: User provides email, system sends 6-digit OTP
2. **Verify OTP**: User enters OTP, receives access tokens

#### 3. Profile Management

- Update profile information (name)
- Change password (with old password verification)
- Change PIN (with old PIN verification)

---

## API Endpoints

### Authentication Routes (`/api/v1/auth`)

#### Registration

```http
POST /api/v1/auth/send-registration-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

```http
POST /api/v1/auth/verify-registration-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Login

```http
POST /api/v1/auth/send-login-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

```http
POST /api/v1/auth/verify-login-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Password Reset

```http
POST /api/v1/auth/send-password-reset-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

```http
POST /api/v1/auth/verify-password-reset-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

#### Token Management

```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

```http
GET /api/v1/auth/validate-token
Authorization: Bearer your-access-token
```

```http
POST /api/v1/auth/sign-out
Authorization: Bearer your-access-token
```

---

### User Management Routes (`/api/v1/users`)

#### Profile Management

```http
GET /api/v1/users/me
Authorization: Bearer your-access-token
```

```http
POST /api/v1/users/complete-profile
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "name": "John Doe",
  "password": "securePassword123",
  "pin": "1234"
}
```

```http
PUT /api/v1/users/profile
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "name": "Updated Name"
}
```

```http
PUT /api/v1/users/password
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "oldPassword": "currentPassword",
  "newPassword": "newSecurePassword123"
}
```

```http
PUT /api/v1/users/pin
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "oldPin": "1234",
  "newPin": "5678"
}
```

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Security Features

1. **OTP Expiration**: All OTPs expire after 10 minutes
2. **Rate Limiting**: Maximum 5 OTP attempts per session
3. **Auto-cleanup**: Used/expired OTPs are automatically removed
4. **Account Locking**: Accounts are locked after failed attempts
5. **Password Security**: Passwords are hashed using bcrypt with salt rounds
6. **JWT Tokens**: Secure access and refresh token system

---

## Environment Variables Required

```env
# Database
DB_URI=mongodb://localhost:27017/fastlink

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server
PORT=3000
NODE_ENV=development
```

---

## Migration from Legacy System

Legacy endpoints return `410 Gone` status with migration instructions:

- `/sign-up` → Use `/send-registration-otp` + `/verify-registration-otp`
- `/sign-in` → Use `/send-login-otp` + `/verify-login-otp`
- `/forgot-password` → Use `/send-password-reset-otp`
- `/reset-password/:token` → Use `/verify-password-reset-otp`
- `/verify-email/:token` → Use `/verify-registration-otp`
