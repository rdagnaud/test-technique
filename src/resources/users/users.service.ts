import type { User } from '~~/types/users'
import { checkUsernameAndPassword, encryptPassword } from '~/utils/users'
import { BadRequestException, NotFoundException } from '~/utils/exceptions'

const sqlite3 = require('sqlite3').verbose();

export class UsersService {
    async create(userData: any): Promise<User> {
        try {
            const username: string = userData.username
            const password: string = userData.password

            if (username === undefined || password === undefined)
                throw new BadRequestException(`No username or password provided`)

            checkUsernameAndPassword(username, password)

            const db = new sqlite3.Database('database/database_technical_test.sqlite');

            const checkExistingUsernameQuery: string = `SELECT id FROM users WHERE username = ?`
            const existingID:number = await new Promise((resolve, reject) =>
                db.run(checkExistingUsernameQuery, [username], function (this: any, error: string) {
                    error ? reject(error) : resolve(this.lastID)
                }))

            if (existingID >= 0)
                throw new BadRequestException(`Username is already taken`)


            const encryptedPassword: string = await encryptPassword(password)

            /**
             * This shouldn't happen as if the encryption failed, an error should have been thrown. Still checking (better safe than sorry)
             */
            if (encryptedPassword === ``)
                throw `Failed to encrypt password`

            const insertUserQuery: string = `INSERT INTO users (username, password) VALUES (?, ?)`
            const id:number = await new Promise((resolve, reject) =>
                db.run(insertUserQuery, [username, encryptedPassword], function (this: any, error: string) {
                    error ? reject(error) : resolve(this.lastID)
                }))

            db.close()

            return {id, username}
        } catch (error) {
            throw (error)
        }
    }
}
