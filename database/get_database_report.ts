import { config } from '~/config'

const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(config.DATABASE_PATH)

const fetchAllUsersQuery: string = `SELECT id, username FROM users`
const fetchAllProductsByUserQuery: string = `SELECT name, description FROM products WHERE user_id = ?`

db.all(fetchAllUsersQuery, (error: string, userRows: any[]) => {
    if (error)
        throw(error)

    console.log("There is a total of " + userRows.length + " users.")

    userRows.forEach(userRow => {
        db.all(fetchAllProductsByUserQuery, [userRow.id], (error: string, productRows: any[]) => {
            if (error)
                throw(error)

            console.log("User " + userRow.username + " has " + productRows.length + " products registered.")
        }
    )});
})

db.close()