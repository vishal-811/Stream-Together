import { Router, Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { videoUploadSchema } from "../lib/zodSchema";
import { customError } from "../lib/customError";
import apiResponse from "../lib/apiResponse";
import { postPresignedUrl } from "../lib/aws";

const router = Router();

router.post("/upload", authMiddleware, (req: Request, res: Response) => {
  const videoUploadPayload = videoUploadSchema.safeParse(req.body);

  try {
    if (!videoUploadPayload.success)
      throw new customError("Invalid inputs", 401);

    const { title, description } = videoUploadPayload.data;

    // Give the presigned url to upload the video to the s3.
    
    // put the metadata to the db.

    // send the video id of the s3 to the redis queue.
  } catch (error: unknown) {
    if (error instanceof customError) {
      apiResponse(res, error.statusCode, error.message);
      return;
    }
    apiResponse(res, 500, "Internal server Error");
  }
});

router.get("/postPreSignedUrl",authMiddleware,async(req: Request,res: Response) => {
   const fileName = "" //fileName.
   const url = await postPresignedUrl(fileName);
   if(!url){
    apiResponse(res,500,"Something went wrong");
    return;
   }
   apiResponse(res,200,{signedUrl: url});
})

router.get( )

export default router;
