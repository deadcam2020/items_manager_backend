import { Router } from "express";
import { AdminController } from "../controllers/admin.js";


export const createAdminRouter = ({ adminModel }) => {
    const adminRouter = Router();
    const adminControler = new AdminController({ adminModel });

    adminRouter.get('/allProducts', adminControler.getAllProducts)
    adminRouter.get('/categories', adminControler.getCategories)
    adminRouter.get('/home_data', adminControler.getAdminHomeData)
    adminRouter.get('/users_info', adminControler.usersGeneralInfo)
    adminRouter.get('/products_by_category', adminControler.getProductsByCategory)
    adminRouter.get('/dashboard_stats', adminControler.getDashboardStats)
    adminRouter.get('/all_reports', adminControler.getAllReports)
    adminRouter.get('/all_reports', adminControler.getAllReports)
    adminRouter.put('/report_response/:id', adminControler.reportRResponse)







    return adminRouter

}