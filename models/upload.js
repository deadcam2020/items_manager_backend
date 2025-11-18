import { uploadImage } from "../utils.js";

export class UploadModel {
  static async uploadProfileImage(filePath) {
    try {
      const result = await uploadImage({
        filePath,
        folder: "items_manager_profile", //carpeta que hemos creado en Cloudinary para las imágenes de los usuarios
      });
      return result;
    } catch (error) {
      console.error("UploadModel error:", error);
      return null;
    }
  }

  static async uploadProductImage(filePath) {
    try {
      const result = await uploadImage({
        filePath,
        folder: "items_manager", //carpeta que hemos creado en Cloudinary para las imágenes de los productos
      });
      return result;
    } catch (error) {
      console.error("UploadModel error:", error);
      return null;
    }
  }

  // static async delete(fileId) {
  //   try {
  //     await deleteImage(fileId)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

}
