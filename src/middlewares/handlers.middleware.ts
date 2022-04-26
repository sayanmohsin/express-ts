const { env }: any = process;

// imports
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "@utils/server.util";
import { logger } from "@configs/log.config";

export const forbiddenHandlerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info("Forbidden");
  next(new ErrorHandler(403, "Forbidden"));
};

export const notFoundHandlerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info("Not found");
  next(new ErrorHandler(404, "Not found"));
};

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const node_env: string = (env.NODE_ENV as string) || req.app.get("env");

  // set locals, only providing error in development
  res.locals.message = err.message;

  res.locals.error =
    node_env === "development" || node_env == "local" ? err : {};

  logger.debug(err.message);

  res.status(err.statusCode || 400).send({
    code: err.code || err.statusCode || 400,
    error: err.message,
  });

  next();
};
