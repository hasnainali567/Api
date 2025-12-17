import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new ApiError(401, 'Authorization header missing or malformed').error(res);
        }
        const token = authHeader.split(' ')[1];
        // You can add token verification logic here
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return new ApiError(401, 'Invalid token').error(res);
        }
        req.user = decoded; // Attach decoded token to request object
        next();
    } catch (error) {
        return new ApiError(401, 'Unauthorized: ' + error.message).error(res);
    }
}

export default authMiddleware;