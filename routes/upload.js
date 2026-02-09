import { Router } from 'express';
import { UploadController } from '../controllers/upload.js';
import { veryfyToken } from '../middlewares/verifyToken.js';
import { UploadModel } from '../models/upload.js'; // 👈 asegúrate de importarlo

export const createUploadRouter = () => {
  const uploadRouter = Router();

  const uploadController = new UploadController({ uploadModel: UploadModel });

  uploadRouter.post('/productImage', veryfyToken, uploadController.uploadProductImage);
  uploadRouter.post('/profileImage', veryfyToken, uploadController.uploadProfileImage);
  uploadRouter.post('/reportImage', veryfyToken, uploadController.uploadReportImage);


  return uploadRouter;
};
