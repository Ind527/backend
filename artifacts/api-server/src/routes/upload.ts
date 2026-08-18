import { randomUUID } from "node:crypto";
import path from "node:path";
import { Router, type IRouter } from "express";
import multer from "multer";
import { supabase } from "../services/supabase";

const router: IRouter = Router();
const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VIDEO_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("video/")) {
      callback(new Error("Only video files are accepted."));
      return;
    }

    callback(null, true);
  },
});

router.post("/upload-video", upload.single("video"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: 'A video file is required in the "video" field.',
    });
    return;
  }

  const extension = path.extname(req.file.originalname).toLowerCase();
  const filePath = `uploads/${Date.now()}-${randomUUID()}${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("videos")
    .upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    req.log.error({ err: uploadError }, "Failed to upload video");
    res.status(502).json({
      success: false,
      error: "Failed to upload video to Supabase Storage.",
      details: uploadError.message,
    });
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("videos")
    .getPublicUrl(filePath);

  res.status(201).json({
    success: true,
    data: {
      path: filePath,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      publicUrl: publicUrlData.publicUrl,
    },
  });
});

export default router;