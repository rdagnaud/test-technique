import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { UnauthorizedException } from '~/utils/exceptions'
import { config } from '~/config'

export interface CustomRequest extends Request {
    token: JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header(`Authorization`)?.replace(`Bearer `, ``)
    
        if (!token) {
            throw new UnauthorizedException
        }
    
        const decoded: JwtPayload = jwt.verify(token, config.SECRET_KEY) as JwtPayload
        ;(req as CustomRequest).token = decoded
    
        next()
    } catch (err) {
        throw new UnauthorizedException
    }
};