import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Region from "../../../models/Region";


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
                const region = await Region.find({})
                res.status(200).json({ success: true, data: region })
            } catch (error) {
                res.status(400).json({ success: false })

            }

            break

        case "POST":
            try {

                const region = await Region.create(
                    req.body
                )
                res.status(201).json({ success: true, data: region })
            } catch (error) {
                res.status(400).json({ success: false })
                console.log(error)
            }
        
            break
           

        default:
            break
    }
}
