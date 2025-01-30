import type { User } from '~~/types/users'
import { checkUsernameAndPassword } from '~/utils/users'
import { BadRequestException, NotFoundException } from '~/utils/exceptions'

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/database_technical_test.sqlite');

export class UsersService {
  create(userData: Omit<User, 'id'>): User {
    const username: string = userData.username
    const password: string = userData.password

    if (username === undefined || password === undefined) {
        throw new BadRequestException(`No username or password provided`)
    }

    checkUsernameAndPassword(username, password)

    return newUser
  }
}
