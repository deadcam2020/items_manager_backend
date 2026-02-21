


import { validatePartialReport } from '../schemas/reports.js'
import { validatePartialUser, validateUser } from '../schemas/user.js'

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  createNewUser = async (req, res) => {
    const result = validatePartialUser(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const newUser = await this.userModel.create({ input: result.data })
      res.status(201).json(newUser)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error creating user' })
    }
  }


  updateUser = async (req, res) => {
    const result = validatePartialUser(req.body)
    const userId = req.user.id;
console.log("data int", req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const updatedUser = await this.userModel.updateUser({ id: userId, input: result.data })
      res.status(200).json(updatedUser)



    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error updating user' })
    }

  }

  getProductsPurchasedByUser = async (req, res) => {
    const id = req.params.buyer_id;


    try {
      const products = await this.userModel.findProductsPurchasedByUser(id);

      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No se encontraron productos comprados" });
      }


      //  Devuelve solo el primer producto, no un array
      return res.status(200).json(products);

    } catch (error) {
      console.error("Error en getProductsPurchasedById:", error);
      return res.status(500).json({ error: "Error obteniendo los productos" });
    }
  };

  createNewReport = async (req, res) => {
    const result = validatePartialReport(req.body)
    console.log("data int", req.body);

    console.log("data ", result.data);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const newReport = await this.userModel.createNewReport(result.data);
      res.status(201).json(newReport);
    } catch (error) {
      console.error("Error creating new report:", error);
      res.status(500).json({ error: "Error creating new report" });
    }
  }

}
