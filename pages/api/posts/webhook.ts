import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";
import dayjs from "dayjs";
import AWS from "aws-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    await client.connect();

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const comprehend = new AWS.Comprehend({ apiVersion: "2017-11-27" });

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
      const key = `${postsDate.format("YYYY-MM-DD")}#${(
        parseInt(index) + 1
      ).toString()}`;

      const text = postHtml.replace(/(<([^>]+)>)/gi, "");

      const comprehendEntities = await comprehend
        .detectEntities({
          LanguageCode: "pt",
          Text: text,
        })
        .promise();

      const entities = comprehendEntities.Entities
        ? comprehendEntities.Entities.map((entity: any) => entity.Text)
        : [];

      const post = {
        id: parseInt(index) + 1,
        html: postHtml,
        text: text,
        categories: [],
        entities: entities,
        likes: 0,
        date: postsDate.format(),
      };

      await client.json.set(key, ".", post);
    }

    await client.quit();

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
