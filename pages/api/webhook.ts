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

    /* const result = await client.json.set("post", ".", req.body); */

    const postsHtml = req.body
      .replace(/<span.*?>&nbsp;<\/span>/gi, " ")
      .match(/<p .*?<\/p>/gi);

    const posts = await Promise.all(
      postsHtml.map(async (postHtml: string) => {
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
          date: new Date(),
        };

        const result = await client.json.set(
          new Date().getTime().toString(),
          ".",
          post
        );
      })
    );
    /* .map(async (item: string) => { */
    /*   const text = item.replace(/(<([^>]+)>)/gi, ""); */
    /*   const html = item */
    /*     .replace(/ class=\".*?\"/gm, "") */
    /*     .replace(/ style=\".*?\"/gm, ""); */
    /*   const post = { */
    /*     html, */
    /*     text, */
    /*     categories: [], */
    /*     entities: [], */
    /*     keywords: [], */
    /*     likes: 0, */
    /*     date: new Date(), */
    /*   }; */

    /*   const result = await client.json.set( */
    /*     new Date().getTime().toString(), */
    /*     ".", */
    /*     post */
    /*   ); */

    /*   return result; */
    /* }); */

    await client.quit();

    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
}
