
import dotenv from 'dotenv'
dotenv.config() 

// se extraen las variables globales
export const JWT_SECRET = process.env.JWT_SECRET
export const PORT = process.env.PORT
export const DB_NAME = process.env.DB_NAME
export const HOST = process.env.HOST
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_PORT = process.env.DB_PORT





// credenciales de Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

