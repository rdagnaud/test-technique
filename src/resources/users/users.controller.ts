import { Router } from 'express'
import { UsersService } from '~/resources/users/users.service'

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
  console.log(req.body)
  try {
      const user = await service.create(req.body)

      return res
          .status(201)
          .json(user)
  } catch(error) {
      throw error
  }
})

UsersController.patch('/:id', (req, res) => {
})

UsersController.delete('/:id', (req, res) => {
})

export { UsersController }