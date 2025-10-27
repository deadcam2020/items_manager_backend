

export class ProductsController {

    constructor({ productsModel }) {
        this.productsModel = productsModel;
    }

    createProduct = async (resizeBy, req) => {
        const product = await this.productsModel.create(req.body)

        
    }

}