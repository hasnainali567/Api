class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;
        this.data = null;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    error(res) {
        res.status(this.statusCode).json({
            statusCode : this.statusCode,
            success: this.success,
            message: this.message,
            errors: this.errors,
            data: this.data,
        });
    }
}

export default ApiError;