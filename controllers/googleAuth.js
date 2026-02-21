import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { v4 } from "uuid";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Buscar usuario
    let user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const id = v4(); // Genera un ID único para el nuevo usuario

    if (user.rows.length === 0) {
      user = await pool.query(
        `INSERT INTO users (email, name, google_id, provider, imageurl, id)
         VALUES ($1, $2, $3, 'google', $4, $5)
         RETURNING *`,
        [email, name, sub, picture, id ]
      );
    }

    const dbUser = user.rows[0];

    const appToken = jwt.sign(
      { id: dbUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token: appToken,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid Google token" });
    
  }
};