import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import MongoDBHelper from "../../../../helpers/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await MongoDBHelper.connect();
    const { date, number } = req.query;

    if (!dayjs(date).isValid()) {
      throw new Error("Invalid date");
    }

    if (!number || isNaN(Number(number))) {
      throw new Error("Invalid number");
    }

    const post = await db?.collection("posts").findOne({
      date: {
        $gte: dayjs(date).startOf("day").toDate(),
        $lte: dayjs(date).endOf("day").toDate(),
      },
      number: Number(number),
    });

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
