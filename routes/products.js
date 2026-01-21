import { Router } from 'express'
import { veryfyToken } from '../middlewares/verifyToken.js'
import { ProductsController } from '../controllers/products.js'

export const createProductsRouter = ({ productsModel }) => {
  const productsRouter = Router()
  const productsController = new ProductsController({ productsModel })

  productsRouter.post('/', veryfyToken, productsController.createProduct)
  // productsRouter.get('/products', veryfyToken, productsController.getProducts) 

  productsRouter.get('/userProducts/:uid', veryfyToken, productsController.getUserProducts)
  productsRouter.get('/products/:id', veryfyToken, productsController.getProductsByUser) // obtiene todos los productos que no son del usuarioque hace la petición
  productsRouter.get('/product/:id', veryfyToken, productsController.getProductById)
  

  productsRouter.delete('/deleteProduct/:id', veryfyToken, productsController.deleteProduct)
  productsRouter.put('/update/:id', veryfyToken, productsController.updateProduct);
  productsRouter.post('/sale', veryfyToken, productsController.createSale) 
  productsRouter.get('/search', veryfyToken, productsController.searchProducts) 
  productsRouter.post('/saveToCart', veryfyToken, productsController.addToCart) 
  productsRouter.get('/getCart', veryfyToken, productsController.getCartItems) 
  productsRouter.delete('/deleteFromCart/:id', veryfyToken, productsController.deleteFromCart) 
  productsRouter.post('/addValoration', veryfyToken, productsController.addProductValoration) 






  return productsRouter
}
