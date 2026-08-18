import { Router, type IRouter } from "express";

const router: IRouter = Router();

const healthResponse = {
  success: true,
  message: "SA Media backend is running",
} as const;

router.get(["/health", "/healthz"], (_req, res) => {
  res.json(healthResponse);
});

export default router;
