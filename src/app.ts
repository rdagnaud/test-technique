import cors from 'cors'
import express from 'express'
import 'express-async-errors';

import { config } from '~/config'
import { UsersController } from '~/resources/users/users.controller'
import { ProductsController } from '~/resources/products/products.controller'
import { ExceptionsHandler } from '~/middlewares/exceptions.handler'
import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler'

const sqlite3 = require(`sqlite3`)

const db = new sqlite3.Database(`database/database_technical_test.sqlite`)

const app = express()

app.use(express.json())
app.use(cors())
app.use(require(`body-parser`).json()); 
app.use(require(`body-parser`).urlencoded({ extended: true }));

app.use(`/users`, UsersController)
app.use(`/products`, ProductsController)

/**
 * Errors handling
 */
app.all(`*`, UnknownRoutesHandler)
app.use(ExceptionsHandler)

app.listen(config.API_PORT, () => console.log(`Server running on port ${config.API_PORT}`))