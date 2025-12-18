import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRegisterSchema, userLoginSchema } from '../validation/user.validation.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import ejs from 'ejs';
import transporter from '../utils/transporter.js';


const register = async (req, res) => {
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

        return new ApiResponse(201, { user: { _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt, isVerified: user.isVerified }, token }, 'User registered successfully').send(res);
    } catch (error) {
        return new ApiError(500, error.message).error(res);
    }
}

const login = async (req, res) => {
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

        return new ApiResponse(200, { user: { _id: user._id, username: user.username, email: user.email, createdAt: user.createdAt, isVerified: user.isVerified }, token }, 'Login successful').send(res);
    } catch (error) {
        return new ApiError(500, error.message).error(res);
    }
}

const sendEmail = async (req, res) => {
    try {
        const user = req.user;
        const token = jwt.sign(
            { id: user.id },
            process.env.EMAIL_SECRET,
            { expiresIn: '1h' }
        );

        const template = await fs.promises.readFile('public/template.ejs', 'utf-8');

        const html = ejs.render(template, {
            userName: user.username,
            verificationLink: `${process.env.FRONTEND_URL}?token=${token}`
        });

        await transporter.sendMail({
            from: `"Hasnain Ali" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Verify Email',
            html: html,
        });

        res.status(200).json({ message: 'Verification email sent' });

    } catch (error) {
        return new ApiError(500, error.message).error(res);
    }
}

const verifyEmail = async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) {
            return new ApiError(400, 'Verification token is missing').error(res);
        }
        const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
        if (!decoded) {
            return new ApiError(400, 'Invalid or expired token').error(res);
        }
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return new ApiError(404, 'User not found').error(res);
        }
        user.isVerified = true;
        await user.save();

        return new ApiResponse(200, { user }, 'Email verified successfully').send
            (res);
    } catch (error) {
        return new ApiError(500, error.message).error(res);
    }
}

export { register, login, sendEmail, verifyEmail };