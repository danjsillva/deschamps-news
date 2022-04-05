import type { NextApiRequest, NextApiResponse } from "next";
import { createClient, SchemaFieldTypes } from "redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    await client.connect();

    try {
      await client.ft.create(
        "index:post",
        {
          "$.date": {
            type: SchemaFieldTypes.TEXT,
            AS: "date",
            SORTABLE: true,
          },
          "$.id": {
            type: SchemaFieldTypes.NUMERIC,
            AS: "id",
            SORTABLE: true,
          },
          "$.text": {
            type: SchemaFieldTypes.TEXT,
            AS: "text",
          },
        },
        {
          ON: "JSON",
          PREFIX: "post:",
        }
      );
    } catch (error) {
      console.error(error);
    }

    const { q } = req.query;

    const posts = await client.ft.search("index:post", `@text:${q}*`);

    await client.quit();

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
