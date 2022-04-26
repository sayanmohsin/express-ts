const { env } = process;
import { PrismaClient } from "@prisma/client";
import { logger } from "@configs/log.config";

export declare let prisma: PrismaClient;

export const initDb = async () => {
  try {
    prisma = new PrismaClient({
      log: [
        {
          emit: "stdout",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "info",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ],
      errorFormat: "pretty",
    });
    await prisma.$connect();
    logger.info("database connected✅");
  } catch (e: any) {
    logger.error(e);
  }
};
