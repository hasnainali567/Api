
import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/student.routes.js';
import connectDB from './config/db.js';
import errorMiddleware from './middleware/error.middleware.js';
import userRouter from './routes/user.routes.js';
dotenv.config({ path: './.env' });
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors())
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use('/api/users', userRouter);
app.use('/api/students', studentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(errorMiddleware)


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    });


export default app;
