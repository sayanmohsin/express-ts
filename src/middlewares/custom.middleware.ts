// environment variables
const { env }: any = process;

import { ErrorHandler } from "@utils/server.util";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestIdMw = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = uuidv4();
  res.set("request_id", requestId);
  next();
};
