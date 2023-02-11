import nextConnect from "next-connect"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import { NextApiRequest, NextApiResponse } from "next"
let filename = uuidv4() + "-" + new Date().getTime()
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/images/uploads", // destination folder
    filename: (req: any, file: any, cb: any) => cb(null, getFileName(file))
  })
})

const getFileName = (file: any) => {
  filename +=
    "." +
    file.originalname.substring(
      file.originalname.lastIndexOf(".") + 1,
      file.originalname.length
    )
  return filename
}

const apiRoute = nextConnect({
  onError(error: any, req: NextApiRequest, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` })
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
  }
})

apiRoute.use(upload.array("files")) // attribute name you are sending the file by

apiRoute.post((req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ filename: `/images/uploads/${filename}` }) // response
})

export default apiRoute

export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
}
