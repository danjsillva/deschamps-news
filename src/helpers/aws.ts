import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "us-east-1",
});

const getEntities = async (text: string) => {
  const comprehend = new AWS.Comprehend({ apiVersion: "2017-11-27" });

  const entities = await comprehend
    .detectEntities({
      LanguageCode: "pt",
      Text: text,
    })
    .promise();

  return entities.Entities
    ? entities.Entities.filter((entity: any) =>
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
};

export default { getEntities };
