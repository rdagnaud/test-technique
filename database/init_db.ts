const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('database/database_technical_test.sqlite')

/**
 * Using VARCHAR(60) for password as bcrypt hashes contain excatly 60 characters
 */
const createUsersTable: string = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL
);`

db.exec(createUsersTable)

const createProductsTable: string = `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);`;

db.exec(createProductsTable)

db.close()