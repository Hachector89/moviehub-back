import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JwtPayload } from '../models/jwtPayload';

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}

export function verifyAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Access token missing or malformed' });
    } else {
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || '';

        try {
            const decoded = jwt.verify(token, secret) as JwtPayload;
            req.user = decoded;
            next();
        } catch (err) {
            console.error('JWT verification failed:', err);
            res.status(403).json({ message: 'Invalid or expired token' });
        }
    }
}