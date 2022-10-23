import type { NextApiRequest, NextApiResponse } from "next";
import Region from "../../../models/Region";
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
                const region = await Region.findOne({ "id_region": id })
                res.status(200).json({ success: true, data: region })
            } catch (error) {
                res.status(400).json({ success: false })

            }

            break


        case "PUT":
            try {

                const region = await Region.findOneAndUpdate({ "_id": id },req.body)
                res.status(201).json({ success: true, data: region })
            } catch (error) {
                res.status(400).json({ success: false })
                console.log(error)
            }
        default:
            break
    }
}
