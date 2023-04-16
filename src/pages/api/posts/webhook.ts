import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import { decode } from "html-entities";

import MongoDBHelper from "../../../helpers/mongodb";
import HTMLHelper from "../../../helpers/html";
import AWSHelper from "../../../helpers/aws";
// import TwitterHelper from "../../../helpers/twitter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await MongoDBHelper.connect();
    const { sentDateInGMT, html } = req.body;
    const date = dayjs(sentDateInGMT);

    if (!date.isValid()) {
      throw new Error("Invalid date");
    }

    const paragraphs = HTMLHelper.getParagraphs(html);

    if (!paragraphs.length) {
      throw new Error("Invalid paragraphs");
    }

    for (const [index, paragraph] of paragraphs.entries()) {
      const html = decode(paragraph);
      const text = HTMLHelper.getText(html);
      const entities = await AWSHelper.getEntities(text);

      const post = {
        number: index + 1,
        html: html,
        text: text,
        categories: [],
        entities: Array.from(new Set(entities)),
        likes: 0,
        date: new Date(date.toDate().setHours(3, 0, 0, 0)),
      };

      await db?.collection("posts").insertOne(post);

      if (
        post.number !== 1 &&
        !post.html.toLowerCase().includes("link patrocinado") &&
        !post.html.toLowerCase().includes("link afiliado")
      ) {
        // await TwitterHelper.tweet(post);
      }
    }

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error });
  }
}
