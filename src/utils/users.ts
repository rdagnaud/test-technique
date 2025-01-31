import { BadRequestException } from '~/utils/exceptions'

export function checkUsernameAndPassword(username: string, password: string) {
    /**
     * Checking the byteLength of the provided password as bcrypt only handles first 72 bytes of a string.
     * Any extra bytes would be ignored.
     */
    if (username === undefined || password === undefined)
        throw new BadRequestException(`No username or password provided`)

    if (Buffer.byteLength(password, `utf-8`) > 72) {
        throw new BadRequestException(`Password is too long`)
    }

    if (password.length < 8) {
        throw new BadRequestException(`Password should be at least 8 characters long`)
    }

    if (username.length < 8 || username.length > 20) {
        throw new BadRequestException(`Username length should be between 8 and 20 characters`)
    }
}

export async function encryptPassword(password: string) {
    try {
        const bcrypt = require('bcrypt')
        const saltRounds = 10

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        return hashedPassword
    } catch (error) {
        throw error
    }
}