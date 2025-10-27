import { Router } from 'express';
import { UploadController } from '../controllers/upload.js';
import { veryfyToken } from '../middlewares/verifyToken.js';

export const createUploadRouter = ({ uploadModel }) => {
  const uploadRouter = Router();

  uploadRouter.post('/postImage', veryfyToken, UploadController.uploadPostImage);
  uploadRouter.post('/profileImage', veryfyToken, UploadController.uploadProfileImage);

  return uploadRouter;
};
