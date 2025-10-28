import { uploadImage } from "../utils.js";

export class UploadModel {
  static async uploadProfileImage(filePath) {
    try {
      const result = await uploadImage({
        filePath,
        folder: "items_manager_profile",
      });
      return result;
    } catch (error) {
      console.error("UploadModel error:", error);
      return null;
    }
  }

  static async uploadPostImage(filePath) {
    try {
      const result = await uploadImage({
        filePath,
        folder: "items_manager_posts",
      });
      return result;
    } catch (error) {
      console.error("UploadModel error:", error);
      return null;
    }
  }
}
