import { NotFoundException } from '~/utils/exceptions'

export const UnknownRoutesHandler = () => {
  throw new NotFoundException(`Requested resource doesn't exist`)
}