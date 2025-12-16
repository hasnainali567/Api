import Student from '../models/student.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { studentRegisterSchema, studentUpdateSchema } from '../validation/student.validation.js';
import mongoose from 'mongoose';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createStudent = async (req, res) => {
    try {
        //check if req body is empty or not
        if (!req.body || Object.keys(req.body).length <= 0) {
            return new ApiError(400, 'req body is missing').error(res)
        };

        //validate user input
        await studentRegisterSchema.validateAsync(req.body, { abortEarly: false });
        const profilePic = req.file && req.file?.filename
        const { firstName, lastName, email, phone, gender } = req.body;
        const student = await Student.create({ firstName, lastName, email, phone, gender, profilePic });

        if (!student) {
            return new ApiError(500, 'Something went wrong while adding student')
        }
        return new ApiResponse(201, student, "Student created successfully").send(res);
    } catch (error) {
        //unlink the file first
        if (req.file?.filename) {
            const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);
            fs.unlink(filePath, (err) => {
                if (err) console.error(err);
            })
        }
        // Handle Joi validation errors with details
        if (error.isJoi && error.details) {

            const errorMessages = error.details.map(detail => detail.message);
            return new ApiError(400, "Validation failed", errorMessages).error(res);
        }
        // Handle other errors
        console.error(error);
        return new ApiError(500, "Internal Server Error", error.message).error(res);
    }
}


const getAllStudents = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const options = {
            page,
            limit : 5
        }
        const search = req.query?.search || '';
        const query = {
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ]
        }
        const students = await Student.paginate(query, options);

        //check id students exist or not
        if (!students) {
            throw new ApiError(404, "No students found");
        }

        //send the response
        return new ApiResponse(200, students, "Students fetched successfully").send(res);
    } catch (error) {
        console.error(error);
        return new ApiError(500, "Internal Server Error", error.message).error(res);
    }
}

const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        //check if id provided is valid or not
        if (!mongoose.Types.ObjectId.isValid(id)) return new ApiError(400, 'Invalid Id provided').error(res);
        const student = await Student.findById(id).select('-__v ');

        //check if user exist or not
        if (!student) {
            return new ApiError(404, "Student not found").error(res);
        }

        //send the response
        return new ApiResponse(200, student, "Student fetched successfully").send(res);
    } catch (error) {
        console.error(error);
        return new ApiError(500, "Internal Server Error", error.message).error(res);
    }
}


const updateStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the provided id is valid
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            if (req.file?.filename) {
                const oldFilePath = path.join(__dirname, '../uploads', req.file.filename);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error('Error deleting uploaded file:', err);
                });
            }
            return new ApiError(400, "Invalid Id provided").error(res);
        }

        const exsistingStudent = await Student.findById(id).lean();

        //check if user exists or not
        if (!exsistingStudent) {
            if (req.file?.filename) {
                const oldFilePath = path.join(__dirname, '../uploads', req.file.filename);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error('Error deleting uploaded file:', err);
                });
            }
            return new ApiError(404, 'Student not found').error(res);
        }

        //add profile pic to body object
        req.body.profilePic = req.file && req.file.filename;

        //validate user input 
        await studentUpdateSchema.validateAsync(req.body)

        // Find and update the student
        const student = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: false });

        //check if user updated
        if (!student) {
            return new ApiError(404, "Student not found").error(res);
        }

        //delete user's previous profile pic
        if (req.file && req.file.filename && exsistingStudent.profilePic) {
            const oldFilePath = path.join(__dirname, '../uploads', exsistingStudent.profilePic);
            fs.unlink(oldFilePath, (err) => {
                if (err) console.error('Error deleting old profile picture:', err);
            });
        }


        //return the response
        return new ApiResponse(200, student, "Student updated successfully").send(res);
    } catch (error) {
        console.error(error);
        return new ApiError(500, "Internal Server Error", error.message).error(res);
    }
}

const deleteStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if provided id is valid
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return new ApiError(400, "Invalid Id provided").error(res);
        }

        // Find and delete the student
        const student = await Student.findByIdAndDelete(id);

        //check is user exist or not
        if (!student) {
            return new ApiError(404, "Student not found").error(res);
        }

        // Delete profile picture if it exists
        if (student.profilePic) {
            const filePath = path.join(__dirname, '../uploads', student.profilePic);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting profile picture:', err);
                }
            });
        }

        //send the response
        return new ApiResponse(200, {}, "Student deleted successfully").send(res);
    } catch (error) {

        console.error(error);
        return new ApiError(500, "Internal Server Error", error.message).error(res);
    }
}

export { createStudent, getAllStudents, getStudentById, updateStudentById, deleteStudentById };