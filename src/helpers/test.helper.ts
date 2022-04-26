// environment variables
const { env }: any = process;

export const testHelper = async (): Promise<{
  done: boolean;
}> => {
  try {
    const status = { done: true };
    return status;
  } catch (e) {
    throw e;
  }
};
