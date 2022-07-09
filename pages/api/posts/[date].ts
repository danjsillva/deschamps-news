import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import MongoDBHelper from "../../../helpers/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await MongoDBHelper.connect();
    const { date } = req.query;

    if (!dayjs(String(date)).isValid()) {
      throw new Error("Invalid date");
    }

    const posts = await db
      ?.collection("posts")
      .find({
        date: {
          $gte: dayjs(String(date)).startOf("day").toDate(),
          $lte: dayjs(String(date)).endOf("day").toDate(),
        },
      })
      .toArray();

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
