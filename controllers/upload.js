import { unlink } from "node:fs/promises";
import { UserModel } from "../models/postgresql/userModel.js";

export class UploadController {
  constructor({ uploadModel }) {
    this.uploadModel = uploadModel;
  }

  // 🔹 Subir imagen para posts
  uploadPostImage = async (req, res) => {
    try {
      if (!req.files?.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const filePath = req.files.file.tempFilePath;
      const file = await this.uploadModel.uploadPostImage(filePath);

      // Intentar eliminar el archivo temporal (sin romper si no existe)
      try {
        await unlink(filePath);
      } catch (unlinkErr) {
        console.warn("⚠️ Archivo temporal no encontrado:", unlinkErr.message);
      }

      if (!file) {
        return res.status(400).json({ error: "Error uploading file" });
      }

      return res.status(201).json(file);
    } catch (error) {
      console.error("Error in uploadPostImage:", error);
      res.status(500).json({ error: "Error uploading post image" });
    }
  };

  // 🔹 Subir imagen de perfil
  uploadProfileImage = async (req, res) => {
    try {
      if (!req.files?.profileImage) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const filePath = req.files.profileImage.tempFilePath;

      // Subir a Cloudinary
      const uploadResult = await this.uploadModel.uploadProfileImage(filePath);

      // Intentar eliminar el archivo temporal (sin romper si no existe)
      try {
        await unlink(filePath);
      } catch (unlinkErr) {
        console.warn("⚠️ Archivo temporal no encontrado:", unlinkErr.message);
      }

      if (!uploadResult) {
        return res
          .status(500)
          .json({ error: "Error uploading to Cloudinary" });
      }

      const imageurl = uploadResult.secure_url;
      const imageid = uploadResult.public_id;

      // Actualizar al usuario en la BD
      await UserModel.updateUser({
        id: userId,
        input: { imageurl, imageid },
      });

      return res.status(201).json({ imageurl, imageid });
    } catch (error) {
      console.error("Error in uploadProfileImage:", error);
      res.status(500).json({ error: "Error uploading profile image" });
    }
  };
}
