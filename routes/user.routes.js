import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { login, register, sendEmail, verifyEmail } from '../controllers/user.controller.js';


const router = express.Router();

// Send verification email route
router.post('/send-verify-email', authMiddleware, sendEmail);

router.get('/verify-email', verifyEmail);

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

export default router;