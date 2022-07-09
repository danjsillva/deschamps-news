import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

const connect = async () => {
  try {
    if (!uri) {
      throw new Error("MONGODB_URI is not set");
    }

    const client = new MongoClient(uri, options);

    await client.connect();

    return client.db("deschamps-news");
  } catch (error) {
    console.error(error);
  }
};

export default { connect };
