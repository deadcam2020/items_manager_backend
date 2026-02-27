import { v4 as uuidv4 } from 'uuid'
import pool from "../../db.js";
import { stat } from 'fs';

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
  (SELECT COUNT(*) FROM reports) AS total_reports,  
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

  static async getUsersGeneralInfo() {
    try {
      const query = {
        text: `
          SELECT
            u.id AS user_id,
            u.name AS user_name,

            -- Total de productos comprados
            COALESCE(COUNT(DISTINCT s_buy.id), 0) AS total_purchased,

            -- Total de productos vendidos
            COALESCE(COUNT(DISTINCT s_sell.id), 0) AS total_sold,

            -- Productos diferentes publicados
            COALESCE(COUNT(DISTINCT p.id), 0) AS total_products_published

          FROM users u

          -- Compras
          LEFT JOIN sales s_buy
            ON s_buy.buyer_id = u.id

          -- Ventas
          LEFT JOIN sales s_sell
            ON s_sell.seller_id = u.id

          -- Productos publicados
          LEFT JOIN products p
            ON p.uid = u.id

          GROUP BY u.id, u.name
          ORDER BY u.name;
        `,
      };

      const result = await pool.query(query);
      return result.rows;

    } catch (error) {
      console.error("Error en getUsersGeneralInfo:", error);
      throw error;
    }
  }

  static async countProductsByCategory() {

    try {
      const query = {
        text: `SELECT 
            LOWER(TRIM(category)) AS category,
            COUNT(*) AS total_products
            FROM products
            GROUP BY LOWER(TRIM(category))
            ORDER BY total_products DESC;
 `
      };

      const result = await pool.query(query)

      if (!result) console.log('No hay query')

      return result.rows;

    } catch (error) {
      console.log('countProductsByCategory error: ', error);

    }
  }

  static async best_selling_products_and_sales_per_month() {

    try {
      const result = await pool.query(`
      WITH best_selling_products AS (
        SELECT 
          p.id,
          p.title,
          SUM(s.quantity) AS total_sold
        FROM sales s
        JOIN products p ON p.id = s.product_id
        GROUP BY p.id, p.title
        ORDER BY total_sold DESC
        LIMIT 5
      ),
      sales_per_month AS (
        SELECT 
          TO_CHAR(created_at, 'YYYY-MM') AS month,
          SUM(quantity * unit_price) AS total_sales
        FROM sales
        GROUP BY month
        ORDER BY month
      )
      SELECT
        (SELECT json_agg(best_selling_products) FROM best_selling_products) AS best_products,
        (SELECT json_agg(sales_per_month) FROM sales_per_month) AS sales_by_month;
    `);

      return result.rows[0];
    } catch (error) {
      console.error("Dashboard error:", error);
      throw error;
    }
  }

  static async getAllReports() {
    try {
      const query = {
        text: `
        SELECT 
    r.id,
    r.headline,
    r.description,
    r.status,
    r.created_at,
    r.image_url,
    u.name AS user_name
FROM reports r
INNER JOIN users u ON r.uid = u.id
ORDER BY r.created_at DESC;

        `
      };

      const result = await pool.query(query);
      return result.rows;

    } catch (error) {
      console.error('getAllReports error: ', error);
      throw error;
    }
  }

  static async postReportResponse(response, id) {

    const status = 'resolved'

    try {
      const query = {
        text: `
          UPDATE reports
          SET response = $1, status = $2
          WHERE id = $3
          RETURNING *;
                `,
        values: [response, status, id]
                
      };

      const result = await pool.query(query)

      if (!result) console.log('No hay query')

      return result.rows;

    } catch (error) {
      console.log('getAllProducts error: ', error);

    }
  }
}



