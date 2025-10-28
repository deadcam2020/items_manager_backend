import { Router } from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // ajusta la ruta si tu db.js está en otra carpeta
import dotenv from "dotenv";

dotenv.config();

export const createAuthRouter = () => {
  const router = Router();

  router.get("/check-status", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Consulta a la BD para confirmar que el usuario sigue existiendo
      const result = await pool.query(
        "SELECT id, name, email, role, phone, adress, department, document, imageurl, imageid FROM users WHERE id = $1",
        [decoded.id]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        user,
        token, // puedes devolver el mismo token o regenerar uno nuevo si quieres
      });
    } catch (error) {
      console.error("Error verificando token:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  });

  return router;
};
