import MailParser from "mailparser";
import * as cheerio from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";
import { ImapFlow } from "imapflow";
import dayjs from "dayjs";

import MongoDBHelper from "../../helpers/mongodb";

const imapConfig = {
  host: "imap.zoho.com",
  port: 993,
  secure: true,
  auth: {
    user: process.env.IMAP_USER!,
    pass: process.env.IMAP_PASS!,
  },
  logger: undefined,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let messagesIds = [];
  let totalPosts = 0;

  try {
    const db = await MongoDBHelper.connect();
    const clientProcess = new ImapFlow(imapConfig);

    // Process the new emails
    await clientProcess.connect();
    await clientProcess.mailboxOpen("NewsLetter", { readOnly: false });

    let messages = clientProcess.fetch(
      { seen: false, from: "newsletter@filipedeschamps.com.br" },
      { envelope: true, source: true },
    );

    for await (const message of messages) {
      const emailDate = message.envelope.date;
      const emailParsed = await MailParser.simpleParser(message.source);

      if (!emailParsed.html) {
        console.warn("No HTML found in the email");

        continue;
      }

      const $ = cheerio.load(emailParsed.html || "");
      const paragraphs = $("tbody tr td p").toArray();

      if (!paragraphs.length) {
        console.warn("No paragraphs found in the email");

        continue;
      }

      for (const [index, paragraph] of paragraphs.entries()) {
        $(paragraph).removeAttr("id");
        $(paragraph).removeAttr("class");
        $(paragraph).removeAttr("style");

        $(paragraph)
          .find("*")
          .each((_i, el) => {
            $(el).removeAttr("id");
            $(el).removeAttr("class");
            $(el).removeAttr("style");
            $(el).removeAttr("url-id");
          });

        const html = $.html(paragraph).replace(/\s+/g, " ").trim();
        const text = $(paragraph).text().replace(/\s+/g, " ").trim();
        const number =
          dayjs(emailDate).format("YYYYMMDD") +
          String(index + 1).padStart(2, "0");

        const post = {
          date: emailDate,
          number,
          text,
          html,
          categories: [],
          entities: [],
          sponsored: false,
          likes: 0,
        };

        const result = await db?.collection("posts").updateOne(
          { number: post.number },
          {
            $set: {
              date: post.date,
              number: post.number,
              text: post.text,
              html: post.html,
              categories: post.categories,
              entities: post.entities,
              sponsored: post.sponsored,
            },
          },
          { upsert: true },
        );

        totalPosts++;
      }

      console.log(
        `Email on ${emailDate} processed. Total posts: ${totalPosts}`,
      );
      messagesIds.push(message.uid);
    }

    await clientProcess.mailboxClose();
    await clientProcess.logout();

    // Mark the emails as seen
    const clientAddFlags = new ImapFlow(imapConfig);

    await clientAddFlags.connect();
    await clientAddFlags.mailboxOpen("NewsLetter", { readOnly: false });
    await clientAddFlags.messageFlagsAdd(messagesIds, ["\\Seen"], {
      uid: true,
    });
    await clientAddFlags.mailboxClose();
    await clientAddFlags.logout();

    return res.status(200).json({ success: true, posts: totalPosts });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ success: false, error: String(error) });
  }
}
