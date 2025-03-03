import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    accessKeyId: process.env.ACCESS_KEY_ID!,
  },
});

export async function postPresignedUrl(
  fileName: string,
  fileType: string,
  filePath: string
) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: filePath,
    ContentType: fileType, //video/mp4, img/png.
  });

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 10000,
  });
  return signedUrl;
}

export async function getPresignedUrl(fileName: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `${fileName}`,
  });

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 60,
  });
  return signedUrl;
}

export async function deleteVideoFromS3(Keys: string[]) {
  try {
    await Promise.all(
      Keys.map(async (key) => {
        const command = new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
        });

        await client.send(command);
      })
    );
    return true;
  } catch (error) {
    console.error("error in deleting video or thumbnail from the s3");
    return false;
  }
}
