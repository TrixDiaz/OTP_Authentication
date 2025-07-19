# FastLink - Job Order Management System

A modern full-stack job order management system with secure OTP-based authentication, built with React and Node.js.

## 🚀 Features

### Authentication System

- **OTP-based Registration & Login** - Secure email-based verification
- **Password & PIN Management** - Complete profile management
- **Password Reset** - Secure password recovery via OTP
- **JWT Token Authentication** - Access and refresh token system
- **Rate Limiting** - Protection against brute force attacks

### Job Order Management

- **Customer Information** - Company details, contact person, department
- **Engineer Assignment** - Engineer remarks and approvals
- **Status Tracking** - Order status and timeline management
- **File Attachments** - Support for document attachments
- **Digital Signatures** - Customer and engineer approval system

### Modern UI/UX

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Component Library** - Custom UI components with Radix UI
- **Type Safety** - Full TypeScript implementation
- **Modern Icons** - Lucide React icon library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **pnpm** (v10.10.0 or higher) - Package manager
- **MongoDB** (v6.0 or higher) - Database
- **Git** - Version control

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fastlink
```

### 2. Install Dependencies

Install dependencies for both client and server:

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
DB_URI=mongodb://localhost:27017/fastlink

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Server Configuration
PORT=3000
NODE_ENV=development
SERVER_URL=http://localhost:3000
```

### 4. Email Setup (Gmail)

To enable OTP email functionality:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in the `EMAIL_PASSWORD` environment variable

### 5. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (if using local installation)
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

## 🚀 Running the Application

### Development Mode

Start both server and client in development mode:

```bash
# Terminal 1: Start the server
cd server
pnpm dev

# Terminal 2: Start the client
cd client
pnpm dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Production Mode

```bash
# Build the client
cd client
pnpm build

# Start the server
cd ../server
pnpm start
```

## 📁 Project Structure

```
fastlink/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Base UI components
│   │   │   ├── authCard.tsx
│   │   │   └── ...
│   │   ├── pages/         # Application pages
│   │   │   └── auth/      # Authentication pages
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Node.js Backend API
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   ├── config/            # Configuration files
│   ├── database/          # Database connection
│   ├── package.json
│   └── server.js          # Entry point
└── readme.md
```

## 🔧 API Documentation

The server provides a comprehensive REST API. Key endpoints include:

### Authentication Routes (`/api/v1/auth`)

- `POST /send-registration-otp` - Send registration OTP
- `POST /verify-registration-otp` - Verify registration OTP
- `POST /send-login-otp` - Send login OTP
- `POST /verify-login-otp` - Verify login OTP
- `POST /send-password-reset-otp` - Send password reset OTP
- `POST /verify-password-reset-otp` - Verify password reset OTP

### User Management (`/api/v1/users`)

- `GET /me` - Get current user profile
- `POST /complete-profile` - Complete user profile
- `PUT /profile` - Update profile information
- `PUT /password` - Change password
- `PUT /pin` - Change PIN

### Job Orders (`/api/v1/jobOrder`)

- Job order creation and management endpoints

For detailed API documentation, see `server/API_DOCUMENTATION.md`.

## 🎯 Usage

### Authentication Flow

1. **Registration**:

   - Navigate to `/register`
   - Enter email address
   - Verify OTP sent to email
   - Complete profile with name, password, and PIN

2. **Login**:

   - Navigate to `/login`
   - Enter email address
   - Verify OTP sent to email
   - Access the application

3. **Password Reset**:
   - Navigate to `/forgot-password`
   - Enter email address
   - Verify OTP and set new password

### Frontend Pages

- `/` or `/login` - Login page
- `/register` - Registration page
- `/otp` - OTP verification
- `/password` - Password setup
- `/pin` - PIN setup
- `/forgot-password` - Password reset
- `/other-ways` - Alternative login methods
- `/send-code` - Code sending page

## 🛡️ Security Features

- **OTP Expiration**: All OTPs expire after 10 minutes
- **Rate Limiting**: Maximum 5 OTP attempts per session
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure access and refresh token system
- **Auto Cleanup**: Expired OTPs are automatically removed
- **Input Validation**: Server-side validation using express-validator

## 🔧 Development

### Available Scripts

**Server**:

```bash
pnpm dev      # Start development server with nodemon
pnpm start    # Start production server
```

**Client**:

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm lint     # Run ESLint
```

### Tech Stack

**Frontend**:

- React 19.1.0
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Router DOM
- Zustand (State Management)
- Lucide React (Icons)

**Backend**:

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (Password Hashing)
- Nodemailer (Email Service)
- Express Rate Limit
- Express Validator

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**John Carlien Trix Darlucio**

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:

   - Ensure MongoDB is running
   - Check the `DB_URI` in your `.env` file

2. **Email OTP Not Sending**:

   - Verify Gmail app password is correct
   - Check EMAIL_USER and EMAIL_PASSWORD in `.env`

3. **Port Already in Use**:

   - Change the PORT in `.env` file
   - Kill the process using the port: `lsof -ti:3000 | xargs kill -9`

4. **Build Errors**:
   - Clear node_modules: `rm -rf node_modules && pnpm install`
   - Check Node.js version compatibility

For more help, please check the `server/API_DOCUMENTATION.md` file or create an issue in the repository.
