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

    console.log("Connected to Redis");

    const foo = JSON.parse((await client.get("foo")) || "{}");

    await client.quit();

    res.status(200).json({ data: foo });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error });
  }
}
