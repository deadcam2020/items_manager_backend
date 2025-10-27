
export class UploadController {

    constructor({ uploadModel }) {
        this.uploadModel = uploadModel
    }

    static async uploadPostImage(req, res) {

        if (req.files?.file === null) {
            res.status(400).json({ error: 'No image uploaded' })
        }

        const filePath = req.files.file.tempFilePath;

        const file = await this.uploadModel.uploadPostImage(filePath);

        if (file) return res.status(201).json(file)


        return res.status(400).json({ error: 'No file uploaded' })

    }


      static async uploadProfileImage(req, res) {

        if (req.files?.file === null) {
            res.status(400).json({ error: 'No image uploaded' })
        }

        const filePath = req.files.file.tempFilePath;

        const file = await this.uploadModel.uploadProfileImage(filePath);

        if (file) return res.status(201).json(file)


        return res.status(400).json({ error: 'No file uploaded' })

    }
}

