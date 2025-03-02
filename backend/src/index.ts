import express, { Request, Response } from "express";
import cors from "cors";
import rootRouter from "./routes";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req: Request, res: Response) => {
  res.send("healthy");
});

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
