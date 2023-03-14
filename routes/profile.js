import express from "express";
const router = express.Router();
import upload from "../middleware/upload.js";
import uploadController from "../controller/upload.js";
import AsyncCatch from "../utils/AsyncCatch.js";

router.post("/upload", upload, AsyncCatch(uploadController.uploadFiles));
router.get("/files", AsyncCatch(uploadController.getListFiles));
router.get("/files/:name", AsyncCatch(uploadController.download));

export default router;
