import { Router } from 'express'
import { veryfyToken } from '../middlewares/verifyToken.js'
import { ProductsController } from '../controllers/products.js'

export const createProductsRouter = ({ productsModel }) => {
  const productsRouter = Router()
  const productsController = new ProductsController({ productsModel })

  productsRouter.post('/', veryfyToken, productsController.createProduct)
  productsRouter.get('/products', productsController.getProducts) //todo

  productsRouter.get('/userProducts/:uid', veryfyToken, productsController.getUserProducts)
  productsRouter.get('/product/:id', veryfyToken, productsController.getProductById)
  productsRouter.delete('/deleteProduct/:id', veryfyToken, productsController.deleteProduct)
  productsRouter.put('/update/:id', veryfyToken, productsController.updateProduct);







  return productsRouter
}
