import { Response } from "express";

export default function apiResponse(
  res: Response,
  code: number,
  message: string | object
) {
  return res.status(code).json({ msg: message });
}
