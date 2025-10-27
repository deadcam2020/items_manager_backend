import { Router } from "express";
import { LoginController } from "../controllers/login.js";


export const createLoginRouter = ({loginModel}) => {
    const loginRouter = Router();
    const loginControler = new LoginController({loginModel});

    loginRouter.post('/', loginControler.login)

    return loginRouter

}