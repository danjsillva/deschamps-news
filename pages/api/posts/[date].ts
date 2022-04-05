import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    await client.connect();

    const { date } = req.query;

    let keys = await client.keys(`post:${date}#*`);

    if (!keys.length) {
      await client.quit();

      return res.status(404).json([]);
    }

    const posts = await client.json.mGet(keys, ".");

    await client.quit();

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
