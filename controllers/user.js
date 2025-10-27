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
}
