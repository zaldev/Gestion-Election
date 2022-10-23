import type { NextApiRequest, NextApiResponse } from "next";
import Circonscription from "../../../models/Circonscription";
import dbConnect from "../../../lib/dbConnect";


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
                const circonscriptions = await Circonscription.find({})
                res.status(200).json({ success: true, data: circonscriptions })
            } catch (error) {
                res.status(400).json({ success: false })

            }

            break

        case "POST":
            try {
                const circonscription = await Circonscription.create(
                    req.body
                )
                res.status(201).json({ success: true, data: circonscription })
            } catch (error) {
                res.status(400).json({ success: false })
                console.log(error)
            }
            break

        default:
            break
    }
}
