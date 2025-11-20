import { validateProduct, validatePartialProduct } from "../schemas/product.js";
import { validatePartialSale, validateSale } from "../schemas/sales.js";
import { deleteImage } from "../utils.js";


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

        console.log(result.data);


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
            return res.status(200).json(product);

        } catch (error) {
            console.error("Error en getProductById:", error);
            return res.status(500).json({ error: "Error obteniendo el producto" });
        }
    };


    getProducts = async (req, res) => {

        try {
            const products = await this.productsModel.getAllProducts();

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


    deleteProduct = async (req, res) => {
        const { id } = req.params;

        try {
            // 1️⃣ Buscar el producto antes de borrarlo para obtener el imageid
            const product = await this.productsModel.findProductById(id);

            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            // 2️⃣ Eliminar el producto de la BD
            const deleted = await this.productsModel.deleteProductById(id);

            console.log(product.id);
            console.log(product.imageid);


            // 3️⃣ Eliminar la imagen de Cloudinary si existe
            if (product.imageid) {
                const delatedImage = await deleteImage(product.imageid);
                console.log(deleteImage);

            }

            if (!deleted) {
                return res.status(404).json({ message: "No se pudo eliminar el producto" });
            }

            return res.status(200).json({ message: "Producto eliminado correctamente" });
        } catch (error) {
            console.error("Error en deleteProduct:", error);
            return res.status(500).json({ error: "Error eliminando el producto" });
        }
    };


    updateProduct = async (req, res) => {
        const result = validatePartialProduct(req.body);
        const id = req.params.id;

        const { oldImageId } = req.body;

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        try {

            //  Actualizar producto
            const updatedProduct = await this.productsModel.updateProductById({
                id,
                input: result.data,
            });

            //  Si viene oldImageId, eliminar imagen previa en Cloudinary
            if (oldImageId) {
                try {
                    await deleteImage(oldImageId);
                } catch (err) {
                    console.warn("No se pudo eliminar la imagen anterior:", err.message);
                }
            }
            res.status(200).json(updatedProduct);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating product' });
        }
    };


    createSale = async (req, res) => {
        const result = validatePartialSale(req.body)
        const buyer_id = result.data.buyer_id;

        console.log('buyer_id: ', buyer_id);

        console.log('result.data: ', result.data);

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        console.log(result.data);


        try {
            const sale = await this.productsModel.saveSale({ buyer_id, input: result.data })
            res.status(201).json(sale)
            return
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Error creating product' })

        }
    }


}