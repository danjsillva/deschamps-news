import { createClient, RedisClientType } from "redis";
import dayjs from "dayjs";

let client: RedisClientType;

const connect = async () => {
  try {
    client = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    await client.connect();
  } catch (error) {
    console.error(error);
  }
};

const save = async (post: any) => {
  try {
    const key = `post:${dayjs(post.date).format(
      "YYYY-MM-DD"
    )}#${post.id.toString()}`;

    await client.json.set(key, ".", post);
  } catch (error) {
    console.error(error);
  }
};

const close = async () => {
  try {
    await client.quit();
  } catch (error) {
    console.error(error);
  }
};

export default { connect, save, close };
