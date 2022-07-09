import type { NextApiRequest, NextApiResponse } from "next";

import MongoDBHelper from "../../../helpers/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await MongoDBHelper.connect();
    const { q: query } = req.query;

    const posts = await db
      ?.collection("posts")
      .find({
        text: { $regex: query, $options: "i" },
      })
      .toArray();

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
