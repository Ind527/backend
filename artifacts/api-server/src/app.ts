import express, {
  type ErrorRequestHandler,
  type Express,
} from "express";
import cors from "cors";
import { MulterError } from "multer";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof MulterError) {
    req.log.warn({ err: error }, "File upload rejected");
    res.status(400).json({
      success: false,
      error:
        error.code === "LIMIT_FILE_SIZE"
          ? "Video file is too large."
          : error.message,
    });
    return;
  }

  if (
    error instanceof Error &&
    error.message === "Only video files are accepted."
  ) {
    req.log.warn({ err: error }, "Non-video file upload rejected");
    res.status(400).json({
      success: false,
      error: error.message,
    });
    return;
  }

  req.log.error({ err: error }, "Unhandled API error");
  res.status(500).json({
    success: false,
    error: "An unexpected server error occurred.",
  });
};

app.use(errorHandler);

export default app;
