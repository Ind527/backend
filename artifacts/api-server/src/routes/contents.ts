import { Router, type IRouter } from "express";
import { supabase } from "../services/supabase";

const router: IRouter = Router();

router.get("/contents", async (req, res) => {
  const { data, error } = await supabase
    .from("contents")
    .select("*, product:products(*)");

  if (error) {
    req.log.error({ err: error }, "Failed to fetch contents");
    res.status(502).json({
      success: false,
      error: "Failed to fetch contents from Supabase.",
    });
    return;
  }

  res.json({ success: true, data });
});

router.post("/contents", async (req, res) => {
  const {
    title,
    video_url: videoUrl,
    caption,
    hashtags,
    product_id: productId,
    scheduled_at: scheduledAt,
    status,
  } = req.body as Record<string, unknown>;

  if (
    typeof title !== "string" ||
    title.trim().length === 0 ||
    typeof videoUrl !== "string" ||
    videoUrl.trim().length === 0 ||
    typeof status !== "string" ||
    status.trim().length === 0
  ) {
    res.status(400).json({
      success: false,
      error: "title, video_url, and status are required.",
    });
    return;
  }

  const { data, error } = await supabase
    .from("contents")
    .insert({
      title: title.trim(),
      video_url: videoUrl.trim(),
      caption: typeof caption === "string" ? caption : null,
      hashtags: typeof hashtags === "string" ? hashtags : null,
      product_id:
        typeof productId === "string" && productId.trim().length > 0
          ? productId
          : null,
      scheduled_at:
        typeof scheduledAt === "string" && scheduledAt.trim().length > 0
          ? scheduledAt
          : null,
      status: status.trim(),
    })
    .select()
    .single();

  if (error) {
    req.log.error({ err: error }, "Failed to create content");
    res.status(502).json({
      success: false,
      error: "Failed to create content in Supabase.",
    });
    return;
  }

  res.status(201).json({ success: true, data });
});

export default router;