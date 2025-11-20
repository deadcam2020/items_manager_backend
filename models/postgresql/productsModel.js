import { v4 as uuidv4 } from 'uuid'
import pool from "../../db.js";
import { deleteImage } from '../../utils.js';

export class ProductsModel {

    static async create({ uid, input }) {
        const { title, description, price, category, imageurl, imageid, seller, stock } = input;

        const id = uuidv4();
        console.log(seller, stock);


        try {
            const query = await pool.query(
                'INSERT INTO products (id, uid, title, description, price, category, imageurl, imageid, seller, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);',
                [id, uid, title, description, price, category, imageurl, imageid, seller, stock]
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


    // static async updateProduct({ id, input }) {
    //     const keys = Object.keys(input)
    //     const values = Object.values(input)

    //     if (keys.length === 0) {
    //         throw new Error('No hay campos para actualizar')
    //     }

    //     const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')

    //     const query = {
    //         text: `UPDATE users SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING id, name, email, document, phone, adress, department, imageurl, imageid;`,
    //         values: [...values, id],
    //     };
    //     const result = await pool.query(query)

    //     if (!result) console.log('No hay query')


    //     return result.rows[0];
    // }



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

            return result.rows[0];

        } catch (error) {
            console.log('findProductById error: ', error);

        }
    }

    static async getAllProducts() {

        try {
            const query = {
                text: `SELECT *
                FROM products
                `
            };

            const result = await pool.query(query)

            if (!result) console.log('No hay query')

            return result.rows;

        } catch (error) {
            console.log('findProductById error: ', error);

        }
    }

    static async deleteProductById(id) {

        try {
            const query = {
                text: `DELETE
                FROM products
                WHERE id = $1`,
                values: [id],
            };

            await pool.query(query)

            //await deleteImage(publicid)

            return true

        } catch (error) {
            console.log('daleteProductById error: ', error);
            throw error
        }
    }

    static async updateProductById({ id, input }) {
        const keys = Object.keys(input)
        const values = Object.values(input)

        if (keys.length === 0) {
            throw new Error('No hay campos para actualizar')
        }

        const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')

        const query = {
            text: `UPDATE products SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING id, uid, title, description, price, category, imageid, imageurl, valoration, created_at;`,
            values: [...values, id],
        };

        const result = await pool.query(query)

        if (!result || result.rows.length === 0) {
            throw new Error('No se pudo actualizar el producto');
        }

        return result.rows[0];
    }


    static async saveSale({ buyer_id, input }) {
        const { seller_id, product_id, unit_price, quantity, payment_method } = input;

        const id = uuidv4();

        try {
            const query = await pool.query(
                'INSERT INTO sales (id, buyer_id, seller_id, product_id, unit_price, quantity, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7);',
                [id, buyer_id, seller_id, product_id, unit_price, quantity, payment_method]
            );

        } catch (error) {
            console.error("Error en saveSale:", error);
            throw new Error("Error creating new product");
        }


        const result = await pool.query(
            `SELECT *
            FROM sales WHERE id = $1;`,
            [id]
        )



        return result.rows
    }

}