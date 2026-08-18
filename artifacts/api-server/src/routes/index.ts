import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import contentsRouter from "./contents";
import creatorsRouter from "./creators";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(contentsRouter);
router.use(creatorsRouter);
router.use(uploadRouter);

export default router;
