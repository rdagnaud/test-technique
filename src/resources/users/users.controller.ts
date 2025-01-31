import { Router } from 'express'
import { UsersService } from '~/resources/users/users.service'
import { auth, CustomRequest } from '~/middlewares/auth.handler'

const UsersController = Router()

const service = new UsersService()

UsersController.post('/', async (req, res) => {
    try {
        const user = await service.create(req.body)

        return res
            .status(201)
            .json(user)
    } catch (error) {
        throw (error)
    }
})

UsersController.post('/auth', async (req, res) => {
    try {
        const JWT = await service.auth(req.body)

        return res
            .status(200)
            .json({jwt: JWT})
    } catch(error) {
        throw error
    }
})

UsersController.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        await service.delete((req as CustomRequest).token, id)
        return res
            .status(200)
            .json("User successfully deleted")
    } catch(error) {
        throw error
    }
})

export { UsersController }