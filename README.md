# Student Management API

A comprehensive Node.js/Express backend API for user authentication and student management. This project provides a robust system with JWT-based authentication, email verification, file uploads, and complete CRUD operations for student records.

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication & authorization |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email verification & notifications |
| **Multer** | File upload handling |
| **Joi** | Input validation |
| **EJS** | Email templates |
| **CORS** | Cross-origin requests |

## 📁 Project Structure

```
Api/
├── index.js                      # Application entry point
├── package.json                  # Dependencies & scripts
├── .env                          # Environment variables
│
├── config/
│   └── db.js                     # MongoDB connection
│
├── controllers/
│   ├── student.controller.js     # Student CRUD logic
│   └── user.controller.js        # User auth logic
│
├── routes/
│   ├── student.routes.js         # Student endpoints
│   └── user.routes.js            # Auth endpoints
│
├── models/
│   ├── student.model.js          # Student schema
│   └── user.model.js             # User schema
│
├── middleware/
│   ├── auth.middleware.js        # JWT verification
│   ├── error.middleware.js       # Global error handling
│   ├── multer.middleware.js      # File upload config
│   └── cloudinary.middleware.js  # Cloud storage (optional)
│
├── validation/
│   ├── student.validation.js     # Student validation schemas
│   └── user.validation.js        # User validation schemas
│
├── utils/
│   ├── ApiError.js               # Error response utility
│   └── ApiResponse.js            # Success response utility
│
├── uploads/                      # Local file storage
│
└── public/
    ├── template.ejs              # Email template
    └── html/                     # Static HTML files
```

## 📋 Prerequisites

- **Node.js** >= 14.x (LTS recommended)
- **npm** or **yarn**
- **MongoDB** (Local or Cloud - MongoDB Atlas)
- **Gmail Account** (for email verification - optional)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/student_api

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_SECRET=your_email_verification_secret_key
FRONTEND_URL=http://localhost:3000

# Optional: Cloudinary (for cloud image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Note**: For Gmail SMTP, enable "Less secure app access" or use an App-specific password.

### 4. Start the Server

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Mode**:
```bash
node index.js
```

The server will start on `http://localhost:5000`

## 🔐 Authentication System

### User Registration & Login Flow

```
1. User registers → Password hashed with bcryptjs
   ↓
2. User logs in → JWT token generated
   ↓
3. Token stored in frontend (localStorage/cookies)
   ↓
4. Send token in Authorization header for protected routes
   ↓
5. Middleware verifies token → Allows/Denies access
```

### Email Verification Flow

```
1. User requests email verification
   ↓
2. Verification token generated (expires in 1 hour)
   ↓
3. Email sent with verification link
   ↓
4. User clicks link → Token validated
   ↓
5. User marked as verified
```

## 📡 API Endpoints

### Authentication Endpoints (`/api/users`)

#### 1. Register User
```http
POST /api/users/register
```
**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```
**Response (201 - Created):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "isVerified": false,
    "createdAt": "2025-12-18T10:30:00Z"
  },
  "message": "User registered successfully"
}
```

#### 2. Login User
```http
POST /api/users/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```
**Response (200 - Success):**
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "isVerified": false
    }
  },
  "message": "Login successful"
}
```

#### 3. Send Verification Email
```http
POST /api/users/send-verify-email
Authorization: Bearer <your_jwt_token>
```
**Response (200 - Success):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Verification email sent"
}
```

#### 4. Verify Email
```http
GET /api/users/verify-email?token=<verification_token>
```
**Response (200 - Success):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "isVerified": true
  },
  "message": "Email verified successfully"
}
```

---

### Student Management Endpoints (`/api/students`)

**⚠️ All endpoints require JWT authentication** (Bearer token in Authorization header)

#### 1. Create Student
```http
POST /api/students
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```
**Form Data:**
- `firstName`: string (required)
- `lastName`: string (required)
- `email`: string (required, valid email)
- `phone`: string (required)
- `gender`: string (required - "Male", "Female", "Other")
- `profilePic`: file (optional - image only)

**Response (201 - Created):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "gender": "Male",
    "profilePic": "image_filename_123.jpg",
    "createdAt": "2025-12-18T10:35:00Z",
    "updatedAt": "2025-12-18T10:35:00Z"
  },
  "message": "Student created successfully"
}
```

#### 2. Get All Students (Paginated)
```http
GET /api/students?page=1&search=john
Authorization: Bearer <your_jwt_token>
```
**Query Parameters:**
- `page`: number (optional, default: 1)
- `search`: string (optional - searches firstName/lastName)

**Response (200 - Success):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "phone": "+1234567890",
      "gender": "Male",
      "profilePic": "image_filename_123.jpg"
    }
  ],
  "message": "Students retrieved successfully"
}
```

#### 3. Get Student by ID
```http
GET /api/students/:id
Authorization: Bearer <your_jwt_token>
```
**Response (200 - Success):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "gender": "Male",
    "profilePic": "image_filename_123.jpg",
    "createdAt": "2025-12-18T10:35:00Z"
  },
  "message": "Student retrieved successfully"
}
```

#### 4. Update Student
```http
PUT /api/students/:id
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```
**Form Data:** (All optional - send only fields to update)
- `firstName`, `lastName`, `email`, `phone`, `gender`
- `profilePic`: file (optional)

**Response (200 - Success):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jonathan",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "gender": "Male",
    "profilePic": "updated_image_123.jpg",
    "updatedAt": "2025-12-18T11:00:00Z"
  },
  "message": "Student updated successfully"
}
```

#### 5. Delete Student
```http
DELETE /api/students/:id
Authorization: Bearer <your_jwt_token>
```
**Response (200 - Success):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Student deleted successfully"
}
```

---

## 🛡️ Error Handling

All errors follow a standardized format:

**Error Response Example:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "firstName is required",
    "email must be a valid email"
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate email/username)
- `500` - Internal Server Error

## 🔧 Middleware

### 1. Authentication Middleware (`auth.middleware.js`)
- Verifies JWT token from Authorization header
- Extracts user information and attaches to request
- Blocks unauthorized requests with 401 status

### 2. Error Middleware (`error.middleware.js`)
- Catches all errors globally
- Formats error responses consistently
- Logs errors for debugging

### 3. Multer Middleware (`multer.middleware.js`)
- Configures file upload limits and destinations
- Validates file types
- Stores uploaded files locally

## 📊 Database Models

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Student Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required),
  phone: String (required),
  gender: String (required),
  profilePic: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing Endpoints

Use Postman or similar tools to test:

1. **Register** → `POST /api/users/register`
2. **Login** → `POST /api/users/login` (get token)
3. **Create Student** → `POST /api/students` (use token)
4. **Get Students** → `GET /api/students` (use token)

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

This project is licensed under the **ISC** License - see `package.json` for details.

## 🤝 Support

For issues or questions, please open an issue in the repository or contact the development team.

---

**Last Updated**: December 18, 2025
