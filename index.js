import express from "express";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";

import { createUserRouter } from "./routes/user.js";
import { UserModel } from "./models/postgresql/userModel.js"; // 👈 importa tu modelo real
import { createLoginRouter } from "./routes/login.js";
import { LoginModel } from "./models/postgresql/loginModel.js";
import { createAuthRouter } from "./routes/auth.js";
import { createUploadRouter } from "./routes/upload.js";

import dotenv from 'dotenv'
import { UploadModel } from "./models/upload.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
    createParentPath: true
  })
)

// Usa tu router con el modelo real
app.use("/api/users", createUserRouter({ userModel: UserModel }));
app.use("/api/login/", createLoginRouter({loginModel: LoginModel}))
app.use("/api/upload", createUploadRouter({uploadModel: UploadModel}))
app.use("/api/auth", createAuthRouter());

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
