import { TwitterApi } from "twitter-api-v2";
import dayjs from "dayjs";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY!,
  appSecret: process.env.TWITTER_CONSUMER_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

const tweet = async (post: any) => {
  try {
    if (
      !post.html.toLowerCase().includes("link patrocinado") &&
      !post.html.toLowerCase().includes("link afiliado")
    ) {
      let message = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/${dayjs(
        post.date
      ).format("YYYY-MM-DD")}/${post.number}`;

      message = `${post.entities
        .map((entity: string) => `#${entity.replace(/\s/g, "")}`)
        .join(" ")} ${message}`;

      if (message.length < 248) {
        message = `${post.text.substring(
          0,
          280 - message.length - 4
        )}... ${message}`;

        await twitterClient.v2.tweet(message);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export default { tweet };
