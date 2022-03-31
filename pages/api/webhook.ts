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

    await client.json.set("body", ".", req.body);

    const date = new Date(req.body.match(/\d{2}.[A-z]*.\d{4}/));

    await client.json.set("date", ".", date);

    const postsHtml = req.body
      /* .replace(/<span.*?>&nbsp;<\/span>/gi, " ") */
      .replace(/&nbsp;/gi, " ")
      .match(/<p .*?<\/p>/gi);

    await client.json.set("postsHtml", ".", postsHtml);

    for (const postHtml of postsHtml) {
      const text = postHtml.replace(/(<([^>]+)>)/gi, "");
      const html = postHtml
        .replace(/ class=\".*?\"/gm, "")
        .replace(/ style=\".*?\"/gm, "");

      const post = {
        html,
        text,
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
