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

    const {
        query: { id },
        method,
    } = req
    await dbConnect()

    switch (method) {
        case "GET":
            try {
                const circonscription = await Circonscription.findOne({ "id_dep": id })
                res.status(200).json({ success: true, data: circonscription })
            } catch (error) {
                res.status(400).json({ success: false })

            }

            break
        case "PUT":
            try {

                const circonscription = await Circonscription.findOneAndUpdate({ "_id": id }, req.body)
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
