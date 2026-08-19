import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/current-user", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;