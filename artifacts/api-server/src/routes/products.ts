import { Router, type IRouter } from "express";
import { supabase } from "../services/supabase";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    req.log.error({ err: error }, "Failed to fetch products");
    res.status(502).json({
      success: false,
      error: "Failed to fetch products from Supabase.",
    });
    return;
  }

  res.json({ success: true, data });
});

export default router;