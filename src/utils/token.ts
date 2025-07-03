import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export function createToken(user: User): string {
    const jwt_secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        jwt_secret,
        { expiresIn: '1d' }
    );

    return token;
}