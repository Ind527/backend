import { Router, type IRouter } from "express";
import { supabase } from "../services/supabase";

const router: IRouter = Router();

router.get("/creators", async (req, res) => {
  const { data, error } = await supabase.from("creators").select("*");

  if (error) {
    req.log.error({ err: error }, "Failed to fetch creators");
    res.status(502).json({
      success: false,
      error: "Failed to fetch creators from Supabase.",
    });
    return;
  }

  res.json({ success: true, data });
});

router.post("/creators", async (req, res) => {
  const { name, whatsapp_number: whatsappNumber, status, level } =
    req.body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: "name is required.",
    });
    return;
  }

  const { data, error } = await supabase
    .from("creators")
    .insert({
      name: name.trim(),
      whatsapp_number:
        typeof whatsappNumber === "string" ? whatsappNumber.trim() : null,
      status: typeof status === "string" ? status.trim() : null,
      level: typeof level === "string" ? level.trim() : null,
    })
    .select()
    .single();

  if (error) {
    req.log.error({ err: error }, "Failed to create creator");
    res.status(502).json({
      success: false,
      error: "Failed to create creator in Supabase.",
    });
    return;
  }

  res.status(201).json({ success: true, data });
});

export default router;