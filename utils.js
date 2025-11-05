import jwt from "jsonwebtoken"
import { JWT_SECRET } from './config.js'
import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from './config.js'

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

//subir imágenes de Cloudinary. Desde el modelo se envía el path y la carpeta donde queremos guardar la iamgen
export async function uploadImage({ filePath, folder }) {

    const result = await cloudinary.uploader.upload(filePath, {
        folder: folder
    }
    )

    const optimizedUrl = result.secure_url.replace('/upload/', '/upload/q_auto,f_auto/');
    result.optimizedUrl = optimizedUrl;

    return result;


}


export const createToken = (payload) => jwt.sign(payload, JWT_SECRET)