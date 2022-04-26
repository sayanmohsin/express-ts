// imports
import { Router } from "express";
import * as controllers from "@controllers/index";

export const testRouter = async (): Promise<Router> => {
  const router = Router();

  router.get("/test", controllers.getTestCtrl);

  return router;
};
