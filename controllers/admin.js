import { id } from "zod/locales";
import { validatePartialReport } from "../schemas/reports.js";


export class AdminController {

    constructor({ adminModel }) {
        this.adminModel = adminModel;
    }

    getAllProducts = async (req, res) => {

        try {
            const products = await this.adminModel.getAllProducts();

            if (!products || products.length === 0) {
                return res.status(404).json({ message: "No se encontraron productos" });
            }

            //  Devuelve solo el primer producto, no un array
            return res.status(200).json(products);

        } catch (error) {
            console.error("Error en getProductById:", error);
            return res.status(500).json({ error: "Error obteniendo los productos" });
        }
    };



    getCategories = async (req, res) => {

        try {
            const result = await this.adminModel.getCategories();

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No se encontraron categorías" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Error en getCategories:", error);
            return res.status(500).json({ error: "Error obteniendo las categorías" });
        }
    };

    getAdminHomeData = async (req, res) => {

        try {
            const result = await this.adminModel.getAdminHomeData();

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No se encontraron datos" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Error en getAdminHomeData:", error);
            return res.status(500).json({ error: "Error obteniendo la data" });
        }
    };

    usersGeneralInfo = async (req, res) => {

        try {
            const result = await this.adminModel.getUsersGeneralInfo();

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No se encontraron datos" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Error en usersGeneralInfo:", error);
            return res.status(500).json({ error: "Error obteniendo la data" });
        }
    };

    getProductsByCategory = async (req, res) => {

        try {
            const result = await this.adminModel.countProductsByCategory();

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No se encontraron datos" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Error en getProductsByCategory:", error);
            return res.status(500).json({ error: "Error obteniendo la data" });
        }
    };


    getDashboardStats = async (req, res) => {

        try {
            const result = await this.adminModel.best_selling_products_and_sales_per_month();

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No se encontraron datos" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Error en getDashboardStats:", error);
            return res.status(500).json({ error: "Error obteniendo la data del dashboard" });
        }
    };

    getAllReports = async (req, res) => {

        try {
            const result = await this.adminModel.getAllReports();

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No se encontraron reportes" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Error en getAllReports:", error);
            return res.status(500).json({ error: "Error obteniendo los reportes" });
        }
    };


     reportRResponse = async (req, res) => {

        const result =  validatePartialReport(req.body)
        const id = req.params.id
        const response = result.data.response

         if (!result) {
            return res.status(400).json({ message: "Datos inválidos", errors: result.error.errors });
        }

        try {
            const result = await this.adminModel.postReportResponse(response, id);

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "No se encontraron reportes" });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error("Error en reportRResponse:", error);
            return res.status(500).json({ error: "Error actualizando el reporte" });
        }
    };

    

}
