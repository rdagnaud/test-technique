import { Router } from 'express'
import { UsersService } from '~/resources/users/users.service'
import { BadRequestException, NotFoundException } from '~/utils/exceptions'

const UsersController = Router()

const service = new UsersService()

UsersController.post('/', (req, res) => {
  const createdUser = service.create(req.body)

  return res
    .status(201)
    .json(createdUser)
})

/**
 * Mise à jour d'un animal
 */
UsersController.patch('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id)) {
    throw new BadRequestException('ID invalide')
  }

  const updatedPet = service.update(req.body, id)

  return res
    .status(200)
    .json(updatedPet)
})

/**
 * Suppression d'un animal
 */
UsersController.delete('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id)) {
    throw new BadRequestException('ID invalide')
  }

  return res
    .status(200)
    .json(service.delete(id))
})

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { UsersController }