import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};
const client = new MongoClient(String(uri), options);

const connect = async () => {
  try {
    await client.connect();

    return client.db("deschamps-news");
  } catch (error) {
    console.error(error);
  }
};

export default { connect };
