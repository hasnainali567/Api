import mongoose from 'mongoose';
import mongoPaginate from 'mongoose-paginate-v2'

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10,15}$/, 'Please fill a valid phone number']
    },
    profilePic : {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
});

studentSchema.plugin(mongoPaginate)

const Student = mongoose.model('Student', studentSchema);

export default Student;
