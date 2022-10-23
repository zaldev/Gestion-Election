import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Election from "../../../models/Election";


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
                const election = await Election.findOne({ "_id": id })
                res.status(200).json({ success: true, data: election })
            } catch (error) {
                res.status(400).json({ success: false })

            }

            break
        case "PUT":
            try {

                const election = await Election.findOneAndUpdate({ "_id": id }, req.body)
                res.status(201).json({ success: true, data: election })
            } catch (error) {
                res.status(400).json({ success: false })
                console.log(error)
            }
        case "DELETE":
            try {

                const election = await Election.deleteOne({ "_id": id })
                res.status(201).json({ success: true, data: election })
            } catch (error) {
                res.status(400).json({ success: false })
                console.log(error)
            }

        default:
            break
    }
}
