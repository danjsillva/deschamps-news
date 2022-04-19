import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";
import AWS from "aws-sdk";
import { TwitterApi } from "twitter-api-v2";
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

    AWS.config.update({
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      region: "us-east-1",
    });

    const comprehend = new AWS.Comprehend({ apiVersion: "2017-11-27" });

    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY!,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });

    const html = req.body;

    const postsBatches = html.match(/<blockquote.*?<\/blockquote>/gs);

    for (const postsBatch of postsBatches) {
      const postsDate = dayjs(postsBatch.match(/\d{1,2}.[A-z]*.\d{4}/));

      console.log(postsBatch);
      console.log(postsDate);

      const postsHtml = postsBatch
        .replace(/ class=\".*?\"/gm, "")
        .replace(/ style=\".*?\"/gm, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/<span> <\/span>/gim, " ")
        .replace(/<br>/gi, "")
        .replace(/<p><strong><\/strong><\/p>/gim, "")
        .match(/<p>.*?<\/p>/gs);

      for (const [index, postHtml] of postsHtml.entries()) {
        const key = `post:${postsDate.format("YYYY-MM-DD")}#${(
          parseInt(index) + 1
        ).toString()}`;

        const text = postHtml.replace(/(<([^>]+)>)/gi, "");

        const comprehendEntities = await comprehend
          .detectEntities({
            LanguageCode: "pt",
            Text: text,
          })
          .promise();

        let entities = comprehendEntities.Entities
          ? comprehendEntities.Entities.filter((entity: any) =>
              [
                "PERSON",
                "LOCATION",
                "ORGANIZATION",
                "COMMERCIAL_ITEM",
                "EVENT",
                "TITLE",
              ].includes(entity.Type)
            ).map((entity: any) => entity.Text)
          : [];

        const post = {
          id: parseInt(index) + 1,
          html: postHtml,
          text: text,
          categories: [],
          entities: Array.from(new Set(entities)),
          likes: 0,
          date: postsDate.format(),
        };

        await client.json.set(key, ".", post);

        let twitterText = `${
          process.env.NEXT_PUBLIC_APP_BASE_URL
        }/${postsDate.format("YYYY-MM-DD")}/${post.id}`;

        twitterText = `${post.entities
          .map((entity) => `#${entity.replace(/\s/g, "")}`)
          .join(" ")} ${twitterText}`;

        if (twitterText.length < 248) {
          twitterText = `${post.text.substring(
            0,
            280 - twitterText.length - 4
          )}... ${twitterText}`;

          await twitterClient.v2.tweet(twitterText);
        }
      }
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
