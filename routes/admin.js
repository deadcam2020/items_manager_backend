import { Router } from "express";
import { AdminController } from "../controllers/admin.js";


export const createAdminRouter = ({adminModel}) => {
    const adminRouter = Router();
    const adminControler = new AdminController({adminModel});

    adminRouter.get('/allProducts', adminControler.getAllProducts)
    adminRouter.get('/categories', adminControler.getCategories)
    adminRouter.get('/home_data', adminControler.getAdminHomeData)



    return adminRouter

}