import { Router } from 'express'
import { UserController } from '../controllers/user.js'
import { veryfyToken } from '../middlewares/verifyToken.js'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  userRouter.post('/', userController.createNewUser)
  userRouter.put('/update', veryfyToken, userController.updateUser)
  userRouter.get('/myPurchases/:buyer_id', veryfyToken, userController.getProductsPurchasedByUser)
  userRouter.post('/create_report', veryfyToken, userController.createNewReport)



  return userRouter
}
