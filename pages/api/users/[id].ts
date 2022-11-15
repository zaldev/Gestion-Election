import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";


// interface ResponseData {
//     error?: string;
//     msg?: string;
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const {
        query: { id },
        method,
    } = req
    await dbConnect()

    switch (method) {
        case "GET":
            try {
                const user = await User.findOne({ "_id": id })
                res.status(200).json({ success: true, data: user })
            } catch (error) {
                res.status(400).json({ success: false })

            }

            break


        case "PUT":
            try {

                const user = await User.findOneAndUpdate({ "_id": id },req.body)
                res.status(201).json({ success: true, data: user })
            } catch (error) {
                res.status(400).json({ success: false })
                console.log(error)
            }
        default:
            break
    }
}
