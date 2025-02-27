import { Router } from "express";
import authRoute from "./authRoute";
import videoRoute from "./videoRoute";
import roomRoute from "./roomRoute";

const router = Router();

router.use("/auth", authRoute);
router.use("/video", videoRoute);
router.use("/room", roomRoute);

export default router;
