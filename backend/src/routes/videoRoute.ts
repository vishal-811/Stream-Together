import { Router, Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { videoUploadSchema } from "../lib/zodSchema";
import { customError } from "../lib/customError";
import apiResponse from "../lib/apiResponse";
import { postPresignedUrl } from "../lib/aws";
import { prisma } from "../lib/prismaClient";
import { deleteVideoFromS3 } from "../lib/aws";

const router = Router();

router.post("/upload", authMiddleware, async(req: Request, res: Response) => {
  const videoUploadPayload = videoUploadSchema.safeParse(req.body);
  const userId = req.userId;
  try {
    if (!videoUploadPayload.success)
      throw new customError("Invalid inputs", 401);

    const { title, description, videoUrl, thumbnailUrl } = videoUploadPayload.data;

    const videoMetaData = await prisma.video.create({
      data:{
        title: title,
        description: description,
        videoUploaderId: userId,
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl
      }
    })
    apiResponse(res,201,"Video metadata uploaded successfully");
    return;
  } catch (error: unknown) {
    if (error instanceof customError) {
      apiResponse(res, error.statusCode, error.message);
      return;
    }
    apiResponse(res, 500, "Internal server Error");
  }
});

router.get("/all", authMiddleware, async(req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const videos = await prisma.video.findMany({
      where:{
        videoUploaderId:userId
      },
      select:{
        title: true,
        description: true,
        thumbnailUrl: true
      }
    })
    apiResponse(res,200,{ videos: videos });
  } catch (error) {
    apiResponse(res,500,"Internal Server Error");
  }
})

router.get("/:videoId", authMiddleware, async(req: Request, res: Response) => {
   const videoId = req.params.videoId;
   
   if(!videoId)throw new customError("please provide a video Id", 400);
   try {
    const video = await prisma.video.findFirst({
      where:{
        id: videoId
      },
      select:{
        title: true,
        description: true,
        videoUrl: true,
        thumbnailUrl: true
      }
     })
     apiResponse(res,200,{video: video});
   } catch (error: unknown) {
     if(error instanceof customError){
      apiResponse(res,error.statusCode,error.message);
      return;
     }
     apiResponse(res,500,"Internal server error");
   }
})

router.delete("/:videoId", authMiddleware, async(req: Request, res: Response) => {
  const videoId = req.params.videoId;
  if(!videoId)throw new customError("Please provide a video Id", 400);
  
  const videoUrls = await prisma.video.findFirst({
    where:{
      id: videoId
    },
    select:{
      videoUrl: true,
      thumbnailUrl: true
    }
  })
  
  if(!videoUrls?.videoUrl || videoUrls.thumbnailUrl)throw new customError("Error in getting the video url from the db",404);

  const isVideoDeletedFromS3 = await deleteVideoFromS3([videoUrls?.videoUrl, videoUrls?.thumbnailUrl]);
  if(!isVideoDeletedFromS3)throw new Error("Error in deleting the video");

  try {
    const video = await prisma.video.delete({
      where: {
        id: videoId
      }
    })

    apiResponse(res,200,"Video deleted successfully");
  } catch (error: unknown) {
    if(error instanceof customError){
      apiResponse(res,error.statusCode,error.message);
      return;
    }
    if(error instanceof Error)
    apiResponse(res,500,error.message || "Internal Server Error")
  }
})

router.patch("/updateMetaData/:videoId", authMiddleware, async(req: Request, res: Response) =>{
  const videoId = req.params.videoId;

  const updateData : Record<string, string> = {};
  const { title, description } = req.body;

  if(title)updateData.title = title;
  if(description)updateData.description = description;
  
  try {
    if(Object.keys(updateData).length <= 0) throw new customError("No valid Fields to update", 400);

    const updatedMetaData = await prisma.video.update({
      where:{
        id: videoId
      },
      data:updateData
    })
    apiResponse(res,201,"MetaData updated Successfully");
  } catch (error : unknown) {
    if(error instanceof customError){
      apiResponse(res, error.statusCode, error.message);
      return;
    }
    apiResponse(res,500,"Internal server error");
  }
})

router.get("/postPreSignedUrl",authMiddleware,async(req: Request,res: Response) => {
   const { fileName, fileType } = req.body;
   const url = await postPresignedUrl(fileName, fileType);
   if(!url){
    apiResponse(res,500,"Something went wrong");
    return;
   }
   apiResponse(res,200,{signedUrl: url});
})

export default router;
