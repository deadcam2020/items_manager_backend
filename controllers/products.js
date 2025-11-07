import { validateProduct, validatePartialProduct } from "../schemas/product.js";


export class ProductsController {

    constructor({ productsModel }) {
        this.productsModel = productsModel;
    }

    createProduct = async (req, res) => {
        const result = validateProduct(req.body)
        const uid = req.user.id;
        //console.log('UserID: ', uid, 'result.data: ', result.data);

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const newProduct = await this.productsModel.create({ uid, input: result.data })
            res.status(201).json(newProduct)
            return
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Error creating product' })

        }
    }

    getUserProducts = async (req, res) => {
        //const uid = req.user.id;
        //console.log('UserID: ', uid, 'result.data: ', result.data);
        const uid = req.params.uid

        try {
            const products = await this.productsModel.findByUserId(uid)

            if (!products || products.length === 0) {
                res.status(400).json({ message: 'No se encontraros productos de para este usuario' })
            }

            res.status(201).json(products)
            return true
        } catch (error) {
            console.error('Error en getuserProducts', error)
            res.status(500).json({ error: 'Error creating product' })
            return false
        }
    }


    getProductById = async (req, res) => {
        const id = req.params.id;

        try {
            const product = await this.productsModel.findProductById(id);

            if (!product || product.length === 0) {
                return res.status(404).json({ message: "No se encontró este producto" });
            }

            //  Devuelve solo el primer producto, no un array
            return res.status(200).json(product[0]);

        } catch (error) {
            console.error("Error en getProductById:", error);
            return res.status(500).json({ error: "Error obteniendo el producto" });
        }
    };

    deleteProduct = async (req, res) => {
        const { id } = req.params;

        try {
            const result = await this.productsModel.deleteProductById(id);

            if (!result) {
                return res.status(404).json({ message: "No se pudo eliminar este producto" });
            }

            return res.status(200).json({ message: "Producto eliminado correctamente" });

        } catch (error) {
            console.error("Error en deleteProduct:", error);
            return res.status(500).json({ error: "Error eliminando el producto" });
        }
    };

    updateProduct = async (req, res) => {
        const result = validatePartialProduct(req.body);
        const id = req.params.id; // ahora sí, viene de la URL
        console.log(req.body);
        console.log(id);



        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        try {
            const updatedProduct = await this.productsModel.updateProductById({
                id,
                input: result.data,
            });
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating product' });
        }
    };





}