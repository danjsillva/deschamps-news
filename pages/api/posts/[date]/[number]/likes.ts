import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import MongoDBHelper from "../../../../../helpers/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await MongoDBHelper.connect();
    const { date, number } = req.query;

    const post = await db?.collection("posts").findOneAndUpdate(
      {
        date: {
          $gte: dayjs(date).startOf("day").toDate(),
          $lte: dayjs(date).endOf("day").toDate(),
        },
        number: Number(number),
      },
      { $inc: { likes: 1 } }
    );

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
