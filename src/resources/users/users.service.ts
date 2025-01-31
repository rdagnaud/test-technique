import type { User } from '~~/types/users'
import { checkUsernameAndPassword, encryptPassword } from '~/utils/users'
import { BadRequestException, NotFoundException } from '~/utils/exceptions'

const sqlite3 = require('sqlite3').verbose();

export class UsersService {
    async create(userData: any): Promise<User> {
        try {
            const username: string = userData.username
            const password: string = userData.password

            checkUsernameAndPassword(username, password)

            const db = new sqlite3.Database('database/database_technical_test.sqlite');

            const checkExistingUsernameQuery: string = `SELECT rowid AS id FROM users WHERE username = ?`
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

    // async auth(userData: any): Promise<string> {
    //     try {
    //         const username: string = userData.username
    //         const password: string = userData.password

    //         checkUsernameAndPassword(username, password)

    //         const db = new sqlite3.Database('database/database_technical_test.sqlite');

    //         const fetchPasswordByUsernameQuery: string = `SELECT password FROM users WHERE username = ?`
    //         const db_passsword:string = await new Promise((resolve, reject) =>
    //             db.run(fetchPasswordByUsernameQuery, [username], function (error: string, db_password: string) {
    //                 error ? reject(error) : resolve(db_password)
    //             }))

    //     } catch(error) {
    //         throw(error)
    //     }
    // }
}
