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

    const date = new Date(req.body.match(/\d{2}.[A-z]*.\d{4}/));

    const postsHtml = req.body
      .replace(/ class=\".*?\"/gm, "")
      .replace(/ style=\".*?\"/gm, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/<span> <\/span>/gi, " ")
      .replace(/<br>/gi, " ")
      .match(/<p .*?<\/p>/gi);

    for (const postHtml of postsHtml) {
      const post = {
        html: postHtml,
        text: postHtml.replace(/(<([^>]+)>)/gi, ""),
        categories: [],
        entities: [],
        keywords: [],
        likes: 0,
        date,
      };

      await client.json.set(new Date().getTime().toString(), ".", post);
    }

    await client.quit();

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
}
