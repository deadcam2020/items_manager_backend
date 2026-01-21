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
            console.log('getAllProducts error: ', error);

        }
    }

    static async getCategories() {

        try {
            const query = {
                text: `SELECT 
  MIN(category) AS category,
  COUNT(*) AS total_products
FROM products
GROUP BY LOWER(category)
ORDER BY total_products DESC;

                `
            };

            const result = await pool.query(query)

            if (!result) console.log('No hay query')

            return result.rows;

        } catch (error) {
            console.log('getCategories error: ', error);

        }
    }

        static async getAdminHomeData() {

        try {
            const query = {
                text: `SELECT 
  (SELECT COUNT(*) FROM products) AS total_products,
  (SELECT COUNT(DISTINCT LOWER(category)) FROM products) AS total_categories,
  (SELECT COUNT(*) FROM users) AS total_users;
                `
            };

            const result = await pool.query(query)

            if (!result) console.log('No hay query')

            return result.rows[0];

        } catch (error) {
            console.log('getAdminHomeData error: ', error);

        }
    }

}




