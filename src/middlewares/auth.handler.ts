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
            throw new UnauthorizedException (`You must be authenticated to perform this request`)
        }
    
        const decoded: JwtPayload = jwt.verify(token, config.SECRET_KEY) as JwtPayload
        ;(req as CustomRequest).token = decoded
    
        next()
    } catch (error) {
        throw new UnauthorizedException (error)
    }
};