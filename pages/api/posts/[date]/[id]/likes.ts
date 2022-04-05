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

    const { date, id } = req.query;

    let keys = await client.keys(`post:${date}#${id}`);

    if (!keys.length) {
      await client.quit();

      return res.status(404).json({});
    }

    await client.json.numIncrBy(`post:${date}#${id}`, ".likes", 1);

    const post = await client.json.get(`post:${date}#${id}`);

    await client.quit();

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
