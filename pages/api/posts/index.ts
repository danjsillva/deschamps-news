import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";
import dayjs from "dayjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    await client.connect();

    let keys = await client.keys(
      `${dayjs("2020-12-25").format("YYYY-MM-DD")}*`
    );

    if (!keys.length) {
      keys = await client.keys(
        `${dayjs("2020-12-25").subtract(1, "day").format("YYYY-MM-DD")}*`
      );
    }

    const posts = await client.json.mGet(keys, ".");

    await client.quit();

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error });
  }
}
