import { Router } from 'express'
import { veryfyToken } from '../middlewares/verifyToken.js'
import { ProductsController } from '../controllers/products.js'

export const createProductsRouter = ({ productsModel }) => {
  const productsRouter = Router()
  const productsController = new ProductsController({productsModel})

  productsRouter.post('/', veryfyToken, productsController.createProduct)
  productsRouter.get('/userProducts/:uid', veryfyToken, productsController.getUserProducts)
  productsRouter.get('/product/:id', veryfyToken, productsController.getProductById)



  return productsRouter
}
