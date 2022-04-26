// environment variables
const { env } = process;
const appVer = env.APP_VER ? env.APP_VER : "2.0";

// imports
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import favicon from "serve-favicon";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { normalizePort } from "@utils/server.util";
import { initDb } from "@configs/db.config";
import { testRouter } from "@routes/index";

import {
  forbiddenHandlerMiddleware,
  notFoundHandlerMiddleware,
  errorHandlerMiddleware,
} from "@middlewares/handlers.middleware";
import { loggerMw, logger, initLogger } from "@configs/log.config";
import { requestIdMw } from "@middlewares/custom.middleware";

const appInstance = (async () => {
  try {
    await initLogger();
    await Promise.all([initDb()]);

    logger.info("starting server🕐");
    const app: Application = express();
    const port: string = normalizePort(env.PORT || "3030");

    // middlewares
    app.use(cors());
    app.options("*", cors() as any);
    app.use(loggerMw());
    app.use("/", express.static(path.join(__dirname, "../public")));
    app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
    app.use(helmet());
    app.use(compression());
    app.use(requestIdMw);
    app.use(
      express.json({
        limit: "50mb",
      }) as any,
    );
    app.use(
      express.urlencoded({
        limit: "50mb",
        extended: true,
      }) as any,
    );
    app.use(cookieParser());
    app.all("/health", (req: Request, res: Response, next: NextFunction) => {
      try {
        res.send({
          health: true,
          message: "OK",
          version: 1.2,
          environment: env.NODE_ENV,
          app_env: env.APP_ENV,
          uptime: process.uptime(),
          timestamp: Date.now(),
        });
      } catch (err) {
        next(err);
      }
    });

    app.use("/test", await testRouter());

    // auth error
    app.get("/forbidden", forbiddenHandlerMiddleware);

    // catch 404 and forward to error handler
    app.use(notFoundHandlerMiddleware);

    // // error handler
    app.use(errorHandlerMiddleware);

    app.listen(port, (): void => {
      logger.info(`express-ts started on port: ${port}🔋`);
      logger.info(`${env.APP_ENV} env and ${env.NODE_ENV} mode`);
      logger.info(`ver: ${appVer}`);
    });
  } catch (e: any) {
    logger.error("e: ", e);
    logger.error(`server start error due to ${e.message}`);
  }
})();

export default appInstance;
