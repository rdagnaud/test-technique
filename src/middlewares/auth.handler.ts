import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { UnauthorizedException } from '~/utils/exceptions'

export const SECRET_KEY: Secret = '4229F57CB23A5C920A4F8FF229FA913575F7D8AFAC36F0FE280A8137C33550AC'

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
    
        if (!token) {
            throw new UnauthorizedException
        }
    
        const decoded: string | JwtPayload = jwt.verify(token, SECRET_KEY)
        ;(req as CustomRequest).token = decoded
    
        next()
    } catch (err) {
        throw new UnauthorizedException
    }
};