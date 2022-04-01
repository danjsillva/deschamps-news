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

    const postsDate = dayjs(req.body.match(/\d{1,2}.[A-z]*.\d{4}/));

    const postsHtml = req.body
      .replace(/ class=\".*?\"/gm, "")
      .replace(/ style=\".*?\"/gm, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/<span> <\/span>/gim, " ")
      .replace(/<br>/gi, "")
      .replace(/<p><strong><\/strong><\/p>/gim, "")
      .match(/<p>.*?<\/p>/gi);

    for (const [index, postHtml] of postsHtml.entries()) {
      const post = {
        html: postHtml,
        text: postHtml.replace(/(<([^>]+)>)/gi, ""),
        categories: [],
        entities: [],
        concepts: [],
        likes: 0,
        date: postsDate.format(),
      };

      const key = `${postsDate.format("YYYY-MM-DD")}#${(
        parseInt(index) + 1
      ).toString()}`;

      await client.json.set(key, ".", { ...post, id: parseInt(index) + 1 });
    }

    await client.quit();

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error });
  }
}
