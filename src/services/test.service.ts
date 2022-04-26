// environment variables
const { env }: any = process;

import { prisma } from "@configs/db.config";
import { Prisma, Users } from "@prisma/client";
import { testHelper } from "@helpers/test.helper";

export const testService = async () => {
  try {
    const test = testHelper();
    return test;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
