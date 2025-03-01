import { Request, Response, NextFunction } from "express";
import { customError } from "../lib/customError";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import apiResponse from "../lib/apiResponse";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId: string;
      isAdmin: boolean;
      roomId: string | null;
      videoId: string | null;
    }
  }
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  try {
    if (!token) throw new customError("Please provide a token", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      isAdmin: boolean;
      roomId: string | null;
      videoId: string | null
    };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof customError) {
      apiResponse(res, error.statusCode, error.message);
      return;
    }
    apiResponse(res, 401, "Token error");
  }
}
