import { v4 as uuidv4 } from 'uuid'
import pool from "../../db.js";
import { deleteImage } from '../../utils.js';

export class ProductsModel {

    static async create({ uid, input }) {
        const { title, description, price, category, imageurl, imageid, seller, stock, status } = input;

        const id = uuidv4();


        try {
            const query = await pool.query(
                'INSERT INTO products (id, uid, title, description, price, category, imageurl, imageid, seller, stock, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);',
                [id, uid, title, description, price, category, imageurl, imageid, seller, stock, status]
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
                text: `SELECT *
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

    static async getAllProducts(id) {

        try {
            const query = {
                text: `SELECT *
                FROM products WHERE uid != $1
                `,
                values: [id]
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
            text: `UPDATE products SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING id, uid, title, description, price, category, imageid, imageurl, valoration, created_at, stock;`,
            values: [...values, id],
        };

        const result = await pool.query(query)

        if (!result || result.rows.length === 0) {
            throw new Error('No se pudo actualizar el producto');
        }

        return result.rows[0];
    }


    static async saveSale({ buyer_id, input }) {
        const { seller_id, seller_name, buyer_name, product_id, unit_price, quantity, payment_method, imageurl, title } = input;

        const id = uuidv4();

        try {
            const query = await pool.query(
                'INSERT INTO sales (id, buyer_id, seller_id, seller_name, buyer_name, product_id, unit_price, quantity, payment_method, imageurl, title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);',
                [id, buyer_id, seller_id, seller_name, buyer_name, product_id, unit_price, quantity, payment_method, imageurl, title,]
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


    static async generateInvoiceNumber() {


        try {
            const query = `
            SELECT invoice_number 
            FROM sales 
            WHERE invoice_number IS NOT NULL
            ORDER BY created_at DESC 
            LIMIT 1;
        `;

            const result = await pool.query(query);

            let nextNumber = 1;

            if (result.rows.length > 0) {
                const lastInvoice = result.rows[0].invoice_number; // FAC-000123

                const numericPart = parseInt(lastInvoice.replace("FAC-", ""), 10);

                nextNumber = numericPart + 1;
            }

            const formatted = String(nextNumber).padStart(6, "0"); // → 000124
            return `FAC-${formatted}`;

        } catch (error) {
            console.error("Error generando número de factura", error);
            throw error;
        }
    }

    static searchProducts = async (text, min, max, id, status) => {
        try {
            let baseQuery = `
      SELECT *
      FROM products
      WHERE (
        unaccent(title) ILIKE unaccent($1)
        OR unaccent(description) ILIKE unaccent($1)
      )
      AND price >= $2
      AND price <= $3
      AND uid != $4
    `;

            const values = [`%${text}%`, min, max, id];
            let paramIndex = 5;

            // Solo filtra si el status es válido
            if (status === "new" || status === "used") {
                baseQuery += ` AND status = $${paramIndex}`;
                values.push(status);
                paramIndex++;
            }

            const query = { text: baseQuery, values };

            const response = await pool.query(query);
            return response.rows;

        } catch (error) {
            console.error("Model Error:", error);
            throw error;
        }
    };


    static addProductToCart = async (input) => {

        const {id, uid, quantity} = input
        try {
            const query = {
                text: `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        RETURNING *;
      `,
                values: [ uid, id,  quantity],
            };

            const result = await pool.query(query);
            return result.rows[0];

        } catch (error) {
            console.error("Error en addProductToCart:", error);
            throw error;
        }
    };




}