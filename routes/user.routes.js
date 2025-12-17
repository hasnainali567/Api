import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRegisterSchema, userLoginSchema } from '../validation/user.validation.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        if (!req.body) {
            return new ApiError(400, 'Request body is missing').error(res);
        }
        await userRegisterSchema.validateAsync(req.body);
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return new ApiError(409, 'Email or Username already in use').error(res);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return new ApiResponse(201, {user : { _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt}, token }, 'User registered successfully').send(res);
    } catch (error) {
        return new ApiError(500, error.message).error(res);
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {

        if (!req.body) {
            return new ApiError(400, 'Request body is missing').error(res);
        }

        await userLoginSchema.validateAsync(req.body);

        const { email, password } = req.body;

        // Find user in database (adjust based on your DB)
        const user = await User.findOne({ email });
        if (!user) return new ApiError(404, 'User not found').error(res);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return new ApiError(401, 'Invalid credentials').error(res);
        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return new ApiResponse(200, {user : { _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt}, token }, 'Login successful').send(res);
    } catch (error) {
        return new ApiError(500, error.message).error(res);
    }
});

export default router;