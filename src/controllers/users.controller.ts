import { Request, Response, NextFunction } from "express";
import { Prisma, SupportMessages, Users } from "@prisma/client";
import { testService } from "@services/test.service";
import { APIRespose } from "@defs/index";

export const getTestCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reponse: APIRespose = {
      data: {},
      success: false,
      message: "Error",
    };

    const test = await testService();

    reponse.data = test;
    reponse.success = true;
    reponse.message = "success";
    res.send(reponse);
  } catch (e: any) {
    next(e);
  }
};
