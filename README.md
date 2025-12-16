## Student API Backend

This is a Node.js/Express backend API for managing students. It uses MongoDB via Mongoose, supports pagination and validation, and handles file uploads (e.g. student images) with Multer and Cloudinary.

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)
- **Auth / Sessions**: `express-session`, `connect-mongo`
- **Validation**: Joi
- **File uploads**: Multer, Cloudinary

### Project Structure
- **`index.js`**: Application entry point / Express bootstrap
- **`config/db.js`**: Database connection configuration
- **`controllers/`**: Request handlers (e.g. `student.controller.js`)
- **`routes/`**: API route definitions (e.g. `student.routes.js`)
- **`models/`**: Mongoose models (e.g. `student.model.js`)
- **`middleware/`**: Custom middleware (multer, Cloudinary, error handling, etc.)
- **`validation/`**: Joi validation schemas
- **`utils/`**: Common utilities such as `ApiError` and `ApiResponse`
- **`uploads/`**: Local upload directory (typically ignored in Git)

### Prerequisites
- **Node.js** (recommended LTS)
- **npm** or **yarn**
- **MongoDB** instance (local or hosted)
- **Cloudinary** account (for image upload, if enabled)

### Installation
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the project root with values appropriate for your environment. For example:
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student_api
   SESSION_SECRET=supersecret

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Running the Project

- **Development**
  ```bash
  npm run dev
  ```
  This uses `nodemon` to restart the server on file changes. By default, the server will start on the port defined in `process.env.PORT` (or whatever is configured inside `index.js`).

- **Production (basic)**
  ```bash
  node index.js
  ```

### API Overview

The main functionality centers around student management. The exact endpoints may vary, but a typical pattern (see `routes/student.routes.js`) would include:

- **`GET /api/students`**: Get paginated list of students
  - **Query params**:
    - `page` (number, optional, default: `1`)
    - `search` (string, optional; matches `firstName` or `lastName`)
- **`GET /api/students/:id`**: Get a single student by ID
- **`POST /api/students`**: Create a new student
- **`PUT /api/students/:id`**: Update an existing student
- **`DELETE /api/students/:id`**: Delete a student

Check `student.routes.js`, `student.controller.js`, and `student.validation.js` to see the exact routes, payloads, and validations implemented in this project.

### Error Handling & Responses
- **`ApiResponse`**: Standardized success responses (e.g. `{ statusCode, data, message }`).
- **`ApiError`**: Standardized error responses and error middleware integration.

### Scripts
- **`npm run dev`**: Start development server with `nodemon`.

You can extend `package.json` with additional scripts for testing, linting, or production deployment as needed.

### Contributing
- Fork the repository
- Create a feature branch (`git checkout -b feature/my-feature`)
- Commit your changes (`git commit -m "Add my feature"`)
- Push the branch (`git push origin feature/my-feature`)
- Open a Pull Request

### License

This project is licensed under the **ISC** license (see `package.json`). You may change the license to suit your needs.


