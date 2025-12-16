import express from 'express';
import { createStudent, getAllStudents, getStudentById, updateStudentById, deleteStudentById } from '../controllers/student.controller.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router();

// Create a new user
router.post('/', upload.single('profilePic'), createStudent);

// // Get all users
router.get('/', getAllStudents);

// // Get a user by ID
router.get('/:id', getStudentById);

// // Update a user by ID
router.put('/:id', upload.single('profilePic'), updateStudentById);

// // Delete a user by ID
router.delete('/:id', deleteStudentById);



export default router;

