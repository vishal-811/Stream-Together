import { Router, Request, Response } from "express";
import { signinSchema, signupSchema } from "../lib/zodSchema";
import apiResponse from "../lib/apiResponse";
import { prisma } from "../lib/prismaClient";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { customError } from "../lib/customError";

dotenv.config();

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const signupPayload = signupSchema.safeParse(req.body);

  try {
    if (!signupPayload.success) {
      apiResponse(res, 400, "Invalid inputs");
      return;
    }

    const { username, email, password } = signupPayload.data;

    const isAlreadyExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isAlreadyExist) {
      apiResponse(res, 409, "User already exist with this credentials");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.cookie("token", token);
    apiResponse(res, 201, "User signup successfully");
    return;
  } catch (error: unknown) {
    if (error instanceof customError) {
      apiResponse(res, error.statusCode, error.message);
      return;
    }
    apiResponse(res, 500, "Internal server Error");
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const signinPayload = signinSchema.safeParse(req.body);

  try {
    if (!signinPayload.success) throw new customError("Invalid inputs", 400);

    const { email, password } = signinPayload.data;

    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!userExist) throw new customError("Wrong credentials", 401);

    const isValidPassword = bcrypt.compare(password, userExist.password);
    if (!isValidPassword) throw new customError("Wrong password", 401);

    const token = jwt.sign({ userId: userExist.id }, process.env.JWT_SECRET!);
    res.cookie("token", token);
    apiResponse(res, 200, "Signin Successfully");
  } catch (error) {
    if (error instanceof customError) {
      apiResponse(res, error.statusCode, error.message);
      return;
    }
    apiResponse(res, 500, "Internal Server Error");
  }
});

export default router;
