import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User, { UserI } from "../../../models/User";
import bcrypt from "bcrypt";


// interface ResponseData {
//     error?: string;
//     msg?: string;
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { method } = req
    await dbConnect()

    switch (method) {
        case "GET":
            try {
                const user = await User.find({})
                res.status(200).json({ success: true, data: user })
            } catch (error) {
                res.status(400).json({ success: false })

            }

            break

        case "POST":
            const userI: UserI = req.body;
            userI.password = await bcrypt.hash((String)(userI.password), 12);
            try {
              const user = await User.create(
                userI
              )
          
              res.status(201).json({ success: true, data: user })
            } catch (error) {
              res.status(400).json({ success: false })
              console.log(error)
            }
        
            break
           

        default:
            break
    }
}
