import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: 'Internal Server Error',
            errors: [err.message || 'Something went wrong']
        })
    }
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: [err.message || 'Something went wrong']
    });
}

export default errorMiddleware;