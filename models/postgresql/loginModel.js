import { createToken } from '../../utils.js'
import bcrypt from 'bcrypt'
import pool from '../../db.js'

export class LoginModel {
  static async login(body) {
    const { email, password } = body

    try {
      const result = await pool.query(
        'SELECT id, name, email, password, document, adress, phone, department, imageurl, imageid, role, created_at FROM users WHERE email = $1;',
        [email]
      )

      const user = result.rows[0]
      if (!user) return null

      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) return null

      const token = createToken({
        id: user.id,
        name: user.name,
        email: user.email
      })

      return { ...user, token }
    } catch (error) {
      console.error('Error al iniciar sesión', error)
      throw new Error('Error al iniciar sesión')
    }
  }
}
