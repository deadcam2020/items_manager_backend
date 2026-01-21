

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

}
