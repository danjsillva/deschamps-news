import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import HTMLHelper from "../../../helpers/html";
import AWSHelper from "../../../helpers/aws";
import RedisHelper from "../../../helpers/redis";
import TwitterHelper from "../../../helpers/twitter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await RedisHelper.connect();

    const { sentDateInGMT, html } = req.body;

    console.log(req.body);
    console.log(sentDateInGMT);
    console.log(html);

    // const date = dayjs(HTMLHelper.getDate(html));
    const date = dayjs(sentDateInGMT);

    if (!date.isValid()) {
      throw new Error("Invalid date");
    }

    const paragraphs = HTMLHelper.getParagraphs(html);

    if (!paragraphs.length) {
      throw new Error("Invalid paragraphs");
    }

    for (const [index, paragraph] of paragraphs.entries()) {
      const text = HTMLHelper.getText(paragraph);
      const entities = await AWSHelper.getEntities(text);

      const post = {
        id: index + 1,
        html: paragraph,
        text: text,
        categories: [],
        entities: Array.from(new Set(entities)),
        likes: 0,
        date: date.format(),
      };

      await RedisHelper.save(post);
      await TwitterHelper.tweet(post);
    }

    await RedisHelper.close();

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
