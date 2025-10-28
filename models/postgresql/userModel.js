import { v4 as uuidv4 } from 'uuid'
import pool from "../../db.js";
import bcrypt from "bcrypt";

export class UserModel {

    static async create({ input }) {
        const { name, email, password } = input;

        // Generar UUID desde Node.js
        const uuId = uuidv4();

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        try {
            const query = await pool.query(
                'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4);',
                [uuId, name, email, passwordHash]
            );

        } catch (error) {
            console.error("Error en UserModel.create:", error);
            throw new Error("Error creating new user");
        }


        const result = await pool.query(
            `SELECT id, name, email, password, created_at
            FROM users WHERE id = $1;`,
            [uuId]
        )



        return result.rows
    }


    static async updateUser({ id, input }) {
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


    // static async updateUser({ id, input }) {
    //     const { name, email, document, phone, adress, department } = input;

    //     try {

    //         const updateUserQuery = {
    //             text: 'UPDATE users SET name = $1, email = $2, document = $3, phone = $4, adress = $5, department = $6 WHERE id = $7;',
    //             values: [name, email, document, phone, adress, department, id]
    //         }
    //         const updatedUser = await pool.query(updateUserQuery)

    //         return updatedUser.rows

    //     } catch (error) {
    //         console.log('userModel: ', error);

    //     }



    // }


}
