import { Router } from 'express'
import { ProductsService } from '~/resources/products/products.service'
import { auth, CustomRequest } from '~/middlewares/auth.handler'
import { Product } from '~~/types/products'

const ProductsController = Router()

const service = new ProductsService()

ProductsController.post('/', auth, async (req, res) => {
    try {
        const product: Product = await service.create(req.body, (req as CustomRequest).token)

        return res
            .status(201)
            .json(product)
    } catch (error) {
        throw (error)
    }
})

ProductsController.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product: Product = await service.get(id)

        return res
            .status(200)
            .json(product)
    } catch(error) {
        throw error
    }
})

ProductsController.get('/', auth, async (req, res) => {
    try {
        const products: Product[] = await service.index()

        return res
            .status(200)
            .json(products)
    } catch(error) {
        throw error
    }
})

ProductsController.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const product: Product = await service.update(id, req.body, (req as CustomRequest).token)

        return res
            .status(200)
            .json(product)
    } catch(error) {
        throw error
    }
})

ProductsController.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        await service.delete(id, (req as CustomRequest).token)
        
        return res
            .status(200)
            .json("Product successfully deleted")
    } catch(error) {
        throw error
    }
})

export { ProductsController }