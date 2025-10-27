import { unlink } from "node:fs/promises";

import { uploadImage } from "../utils"

export class UploadModel {

    static async uploadPostImage(filePath) {

        try {

            const result = await uploadImage(filePath, { folder : "items_manager"});

            await unlink(filePath);

            return result;

        } catch (error) {
            console.log('UploadModer error: ', error);
            return null;
            
        }

        return file
    }

      static async uploadProfileImage(filePath) {

        try {

            const result = await uploadImage(filePath, { folder : "items_manager_profile"});

            await unlink(filePath);

            return result;

        } catch (error) {
            console.log('UploadModer error: ', error);
            return null;
            
        }

        return file
    }

}