import { Router } from "express";
import { AdminController } from "../controllers/admin.js";


export const createAdminRouter = ({adminModel}) => {
    const adminRouter = Router();
    const adminControler = new AdminController({adminModel});

    adminRouter.get('/allProducts', adminControler.getAllProducts)

    return adminRouter

}