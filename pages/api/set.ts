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

    client.rPush("foo", JSON.stringify({ foo: "bar" }));

    await client.quit();

    res.status(200).json({
      message: "Hello World",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
}
