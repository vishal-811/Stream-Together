import { Router, Request, Response } from "express";
import { createRoomSchema } from "../lib/zodSchema";
import { customError } from "../lib/customError";
import apiResponse from "../lib/apiResponse";
import { prisma } from "../lib/prismaClient";
import authMiddleware from "../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/create", authMiddleware, async (req: Request, res: Response) => {
  const createRoomPayload = createRoomSchema.safeParse(req.body);

  try {
    if (!createRoomPayload.success) {
      throw new customError("please provide a valid inputs", 400);
    }

    const userId = req.user.userId;
    if (!userId) throw new customError("please provide a user id", 401);

    const { videoId, title, description } = createRoomPayload.data;

    const room = await prisma.room.create({
      data: {
        videoId: videoId,
        title: title,
        description: description,
        userId: userId,
      },
    });

    const token = jwt.sign(
      { userId: userId, isAdmin: true, roomId: room.id, videoId: videoId },
      process.env.JWT_SECRET!
    );
    res.cookie("token", token);

    apiResponse(res, 201, {
      roomId: room.id,
      title: room.title,
      description: room.description,
    });
  } catch (error) {
    if (error instanceof customError) {
      apiResponse(res, error.statusCode, error.message);
      return;
    }
    if (error instanceof Error) {
      apiResponse(res, 500, "Internal Server Error");
    }
  }
});

router.patch(
  "/update/:roomId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const isAdmin = req.user.isAdmin;

    try {
      if (!isAdmin)
        throw new customError(
          "you are not allowed to perform this action",
          401
        );

      const roomId = req.params.roomId;
      if (!roomId) throw new customError("Please provide a roomid", 400);

      const isRoomExist = await prisma.room.findFirst({
        where: {
          id: roomId,
        },
      });
      if (!isRoomExist)
        throw new customError("Please provide a valid RoomId", 401);

      const updateData: Record<string, string> = {};

      const { title, description, videoId } = req.body;
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (videoId) updateData.videoId = videoId;

      const updateRoom = await prisma.room.update({
        where: {
          id: roomId,
        },
        data: updateData,
      });

      apiResponse(res, 201, { roomId: roomId });
    } catch (error: unknown) {
      if (error instanceof customError) {
        apiResponse(res, error.statusCode, error.message);
        return;
      }
      apiResponse(res, 500, "Internal server Error");
    }
  }
);

router.delete(
  "/leave-room/:roomId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const roomId = req.params.roomId;

    const { userId, isAdmin } = req.user;
    try {
      if (!isAdmin)
        throw new customError(
          "you are not allowed to perform this action",
          403
        );

      if (!roomId) throw new customError("Please provide a roomId", 400);

      const room = await prisma.room.delete({
        where: {
          id: roomId,
        },
      });
      const token = jwt.sign(
        { userId: userId, isAdmin: false, roomId: null },
        process.env.JWT_SECRET!
      );
      res.cookie("token", token);
      apiResponse(res, 204, "Room deleted successfully");
    } catch (error: unknown) {
      if (error instanceof customError) {
        apiResponse(res, error.statusCode, error.message);
        return;
      }
      apiResponse(res, 500, "Internal server error");
    }
  }
);

router.get(
  "/IsRoomExist/:roomId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    try {
      if (!roomId) throw new customError("please provide a roomId", 400);

      const isRoomExist = await prisma.room.findFirst({
        where: {
          id: roomId,
        },
      });
      if (!isRoomExist)
        throw new customError("No room exist with this roomId", 401);
      apiResponse(res, 200, {
        title: isRoomExist.title,
        description: isRoomExist.description,
        videoId: isRoomExist.videoId,
      });
    } catch (error: unknown) {
      if (error instanceof customError) {
        apiResponse(res, error.statusCode, error.message);
        return;
      }
      apiResponse(res, 500, "internal server error");
    }
  }
);

export default router;
