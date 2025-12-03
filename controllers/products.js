import { validatePartialCart } from "../schemas/cart.js";
import { validateProduct, validatePartialProduct } from "../schemas/product.js";
import { validatePartialSale, validateSale } from "../schemas/sales.js";
import { deleteImage } from "../utils.js";
import jwt from "jsonwebtoken";



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
        const { id } = req.query

        try {
            const products = await this.productsModel.getAllProducts(id);

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
        const id = req.params.id;
        const { oldImageId, ...productData } = req.body;

        const result = validatePartialProduct(productData);


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


        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        console.log("Data: ", result.data);


        try {
            const sale = await this.productsModel.saveSale({ buyer_id, input: result.data })
            res.status(201).json(sale)
            return
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Error creating product' })

        }
    }


    searchProducts = async (req, res) => {

        const { query, min = 0, max = 999999999, status = "new" } = req.query;
        console.log("query", req.query);
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id
        try {
            const search = await this.productsModel.searchProducts(query, min, max, id, status);

            return res.status(200).json(search);

        } catch (error) {
            console.log("Error en searchController:", error);
            return res.status(500).json({ error: "Error en búsqueda" });
        }
    };


     addToCart = async (req, res) => {
        const result = validatePartialCart(req.body)
        

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const response = await this.productsModel.addProductToCart(result.data)
            return res.status(201).json(response)
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Error adding to cart' })

        }
    }


}