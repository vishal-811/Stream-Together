import { Router } from "express";
import authRoute from "./authRoute";
import videoRoute from "./videoRoute";

const router = Router();

router.use("/auth", authRoute);
router.use("/video", videoRoute);

export default router;
