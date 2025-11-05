import { v4 as uuidv4 } from 'uuid'
import pool from "../../db.js";

export class ProductsModel {

    static async create({ uid, input }) {
        const { title, description, price, category, imageurl, imageid } = input;

        const id = uuidv4();

        try {
            const query = await pool.query(
                'INSERT INTO products (id, uid, title, description, price, category, imageurl, imageid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
                [id, uid, title, description, price, category, imageurl, imageid]
            );

        } catch (error) {
            console.error("Error en ProductsModel.create:", error);
            throw new Error("Error creating new product");
        }


        const result = await pool.query(
            `SELECT *
            FROM products WHERE id = $1;`,
            [id]
        )



        return result.rows
    }


    static async updateProduct({ id, input }) {
        const keys = Object.keys(input)
        const values = Object.values(input)

        if (keys.length === 0) {
            throw new Error('No hay campos para actualizar')
        }

        const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')

        const query = {
            text: `UPDATE users SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING id, name, email, document, phone, adress, department, imageurl, imageid;`,
            values: [...values, id],
        };
        const result = await pool.query(query)

        if (!result) console.log('No hay query')


        return result.rows[0];
    }



    static async findByUserId(uid) {

        try {

            const query = {
                text: `SELECT id, uid, title, description, price, category, imageurl, imageid, created_at
                FROM products
                WHERE uid = $1
                ORDER BY created_at DESC;`,
                values: [uid],
            };

            const result = await pool.query(query)

            if (!result) console.log('No hay query')


            return result.rows;

        } catch (error) {
            console.log('productsModel error: ', error);

        }



    }



    static async findProductById(id) {

        try {
            const query = {
                text: `SELECT *
                FROM products
                WHERE id = $1`,
                values: [id],
            };

            const result = await pool.query(query)

            if (!result) console.log('No hay query')

            return result.rows;

        } catch (error) {
            console.log('findProductById error: ', error);

        }
    }
}