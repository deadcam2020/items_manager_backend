import { v4 as uuidv4 } from 'uuid'
import pool from "../../db.js";

export class AdminModel {

    static async getAllProducts() {

        try {
            const query = {
                text: `SELECT *
                FROM products;
                `
            };

            const result = await pool.query(query)

            if (!result) console.log('No hay query')

            return result.rows;

        } catch (error) {
            console.log('findProductById error: ', error);

        }
    }

}