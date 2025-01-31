import jwt, { JwtPayload } from 'jsonwebtoken';

import type { Product } from '~~/types/products'
import { BadRequestException, NotFoundException, UnauthorizedException } from '~/utils/exceptions'
import { config } from '~/config'

const sqlite3 = require('sqlite3').verbose();
const databasePath = config.DATABASE_PATH

export class ProductsService {
    async create(productData: Product, token: JwtPayload): Promise<Product> {
        try {
            const userId: string = token._id
            const productName: string = productData.name
            const productDescription: string | undefined = productData.description

            const db = new sqlite3.Database(databasePath);

            /**
             * Checking if user already has added a product with the same name
             */
            const checkExistingProductNameQuery: string = `SELECT id FROM products WHERE user_id = ? AND name = ?`
            const existingID:number = await new Promise((resolve, reject) =>
                db.all(checkExistingProductNameQuery, [userId, productName], (error: string, rows: any) => {
                    if (error)
                        reject(error)
                    if (rows[0])
                        resolve(rows[0].id)
                    resolve(0)
                }))

            if (existingID > 1)
                throw new BadRequestException(`Product name is already taken`)

            /**
             * As product description is optional, we create the query and values differently if product description has been provided or not
             */
            const insertProductQuery: string = productDescription ?
                `INSERT INTO products (name, description, user_id) VALUES (?, ?, ?)` :
                `INSERT INTO products (name, user_id) VALUES (?, ?)`

            const insertProductValues: string[] = productDescription ?
                [productName, productDescription, userId] :
                [productName, userId]
            
            const id: number = await new Promise((resolve, reject) =>
                db.run(insertProductQuery, insertProductValues, function (this: any, error: string) {
                    error ? reject(error) : resolve(this.lastID)
                }))

            db.close()

            return {id, name: productName, description: productDescription, user_id: parseInt(userId)}
        } catch(error) {
            throw (error)
        }
    }

    async get(productId: string): Promise<Product> {
        try {
            const db = new sqlite3.Database(databasePath);
            
            const fetchProductByIdQuery: string = `SELECT id, name, description, user_id FROM products WHERE id = ?`
            const foundProduct: Product = await new Promise((resolve, reject) =>
                db.all(fetchProductByIdQuery, [productId], (error: string, rows: any) => {
                    if (error)
                        reject(error)
                    resolve(rows[0])
                }))
            
            db.close()

            if (!foundProduct)
                throw new NotFoundException(`Product not found`)

            return (foundProduct)
        } catch(error) {
            throw (error)
        }
    }

    async index(): Promise<Product[]> {
        try {
            const db = new sqlite3.Database(databasePath);
            
            const fetchAllProducts: string = `SELECT id, name, description, user_id FROM products`
            const foundProducts: Product[] = await new Promise((resolve, reject) =>
                db.all(fetchAllProducts, (error: string, rows: any) => {
                    if (error)
                        reject(error)
                    resolve(rows)
                }))

            db.close()

            return (foundProducts)
        } catch(error) {
            throw (error)
        }
    }
    
    async update(productId: string, productData: Product, token: JwtPayload): Promise<Product> {
        try {
            const userId: string = token._id
            const productName: string | undefined = productData.name
            const productDescription: string | undefined = productData.description

            const db = new sqlite3.Database(databasePath);

            /**
             * Checking if the requested product exists in the database
             */
            const checkExistingProductQuery: string = `SELECT name, description, id, user_id FROM products WHERE id = ?`
            const foundProduct: Product = await new Promise((resolve, reject) =>
                db.all(checkExistingProductQuery, [productId], (error: string, rows: any) => {
                    if (error)
                        reject(error)
                    resolve(rows[0])
                }))

            if (!foundProduct)
                throw new NotFoundException (`Product not found`)

            /**
             * We also check if the user_id of the product is the same, otherwise the request isn't authorized
             */
            if (foundProduct.user_id.toString() !== userId)
                throw new UnauthorizedException (`You are not authorized to perform this request`)

            /**
             * If no name nor description are provided, we simply return the product as it is
             */
            if (!productName && !productDescription)
                return foundProduct

            /**
             * We create multiple strings before reassembling it in one string to update only the fields provided in the request
             * If no name nor description is provided, the request would fail but the case is already handled beforehand
             */
            const updateProductQueryBase: string = `UPDATE products SET `
            const updateProductQueryCondition: string = `WHERE id = ?`
            const updateProductNameQuery: string = productName ? `name = ? ` : ``
            const updateProductDescriptionQuery: string = productDescription ? `description = ? ` : ``

            const updateProductQuery: string = updateProductQueryBase + updateProductNameQuery + updateProductDescriptionQuery + updateProductQueryCondition

            /**
             * Same principle but with the values
             */
            const updateProductValues: string[] = []

            if (productName)
                updateProductValues.push(productName)
            if (productDescription)
                updateProductValues.push(productDescription)

            updateProductValues.push(productId)

            await db.run(updateProductQuery, updateProductValues, function (error: string) {
                    if (error) throw (error)
                })

            db.close()

            const updatedProduct: Product = {
                id: parseInt(productId),
                name: productName || foundProduct.name,
                description: productDescription || foundProduct.description,
                user_id: parseInt(userId)
            }

            return (updatedProduct)
        } catch(error) {
            throw (error)
        }
    }

    async delete(productId: string, token: JwtPayload): Promise<void> {
        try {
            const userId: string = token._id

            const db = new sqlite3.Database(databasePath);

            const fetchProductByIdQuery: string = `SELECT user_id, id FROM products WHERE id = ?`
            const foundProduct: Product = await new Promise((resolve, reject) =>
                db.all(fetchProductByIdQuery, [productId], (error: string, rows: any) => {
                    if (error)
                        reject(error)
                    resolve(rows[0])
                }))

            if (!foundProduct)
                throw new NotFoundException (`Product not found`)

            if (foundProduct.user_id.toString() !== userId)
                throw new UnauthorizedException (`You are not authorized to delete this product`)

            const deleteProductByIdQuery: string = `DELETE FROM products WHERE id = ?`

            await db.run(deleteProductByIdQuery, [productId], (error: any) => {
                if (error)
                    throw (error)
            })

            db.close()

            return
        } catch(error) {
            throw (error)
        }
    }
}