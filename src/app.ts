import cors from 'cors'
import express from 'express'

import { config } from '~/config'
import { ExceptionsHandler } from '~/middlewares/exceptions.handler'
import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler'

const app = express()

app.use(express.json())
app.use(cors())

/**
 * Gestion des erreurs
 */
app.all('*', UnknownRoutesHandler)
app.use(ExceptionsHandler)

app.listen(config.API_PORT, () => console.log(`Server running on port ${config.API_PORT}`))