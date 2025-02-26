import express, { Request, Response } from "express";
import cors from "cors";
import rootRouter from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());

app.get("/health", (req: Request, res: Response) => {
  res.send("healthy");
});

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
