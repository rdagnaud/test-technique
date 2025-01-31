import jwt, { JwtPayload } from 'jsonwebtoken';

import type { User } from '~~/types/users'
import { checkUsernameAndPassword, encryptPassword, comparePassword } from '~/utils/users'
import { BadRequestException, NotFoundException, UnauthorizedException } from '~/utils/exceptions'
import { config } from '~/config'

const sqlite3 = require('sqlite3').verbose();
const databasePath = config.DATABASE_PATH

export class UsersService {
    async create(userData: any): Promise<Omit<User, `password`>> {
        try {
            const username: string = userData.username
            const password: string = userData.password

            checkUsernameAndPassword(username, password)

            const db = new sqlite3.Database(databasePath);

            const checkExistingUsernameQuery: string = `SELECT id FROM users WHERE username = ?`
            const existingID:number = await new Promise((resolve, reject) =>
                db.all(checkExistingUsernameQuery, [username], (error: string, rows: any) => {
                    if (error)
                        reject(error)
                    if (rows[0])
                        resolve(rows[0].id)
                    resolve(0)
                }))

            if (existingID > 1)
                throw new BadRequestException(`Username is already taken`)

            const encryptedPassword: string = await encryptPassword(password)

            const insertUserQuery: string = `INSERT INTO users (username, password) VALUES (?, ?)`
            const id: number = await new Promise((resolve, reject) =>
                db.run(insertUserQuery, [username, encryptedPassword], function (this: any, error: string) {
                    error ? reject(error) : resolve(this.lastID)
                }))

            db.close()

            return {id, username}
        } catch(error) {
            throw(error)
        }
    }

    async auth(userData: any): Promise<string> {
        try {
            const username: string = userData.username
            const password: string = userData.password

            checkUsernameAndPassword(username, password)

            const db = new sqlite3.Database(databasePath);

            const fetchUserByUsernameQuery: string = `SELECT id, password FROM users WHERE username = ?`
            const foundUser:User = await new Promise((resolve, reject) =>
                db.all(fetchUserByUsernameQuery, [username], (error: string, rows: any) => {
                    if (error)
                        reject(error)
                    resolve(rows[0])
                }))

            db.close()

            if (!foundUser)
                throw new BadRequestException(`Incorrect username or password`)

            if (!await comparePassword(password, foundUser.password))
                throw new BadRequestException(`Incorrect username or password`)

            const JWTToken: string = jwt.sign({_id: foundUser.id.toString(), name: username}, config.SECRET_KEY, { expiresIn: '2 days'})

            return (JWTToken)
        } catch(error) {
            throw (error)
        }
    }

    async delete(token: JwtPayload, id: string): Promise<void> {
        try {
            console.log(token)
            if (token._id !== id)
                throw new UnauthorizedException

            const db = new sqlite3.Database(databasePath);

            /**
             * Checking if the requested user still exists in the database in case the request is done after already deleting the user while
             * the JWT is still active
             */
            const checkExistingUserQuery: string = `SELECT id FROM users WHERE id = ?`
            const foundId: number = await new Promise((resolve, reject) =>
                db.all(checkExistingUserQuery, [id], (error: string, rows: any) => {
                    if (error)
                        reject(error)
                    if (rows[0])
                        resolve(rows[0].id)
                    resolve(0)
                }))

            if (foundId === 0)
                throw new NotFoundException("User has already been deleted")

            const deleteUserByIdQuery: string = `DELETE FROM users WHERE id = ?`

            await db.run(deleteUserByIdQuery, [id], (error: any) => {
                if (error)
                    throw (error)
            })

            db.close()

            return
        } catch(error) {
            throw (error)
        }
    }
}