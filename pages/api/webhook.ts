import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { body, method } = req;

    console.log(body, method);

    res.status(200).json({
      message: "success",
      body,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
}
