import { z } from "zod";

const envSchema = z.object({
  REACT_APP_API_URL: z.string(),
});

const envValues = {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
};

const parsedEnv = envSchema.safeParse(envValues);

if (!parsedEnv.success) {
  console.error(
    "Lỗi trong file .env:",
    JSON.stringify(parsedEnv.error.format(), null, 2)
  );
  throw new Error(
    "Cấu hình môi trường không hợp lệ. Vui lòng kiểm tra lại file .env."
  );
}

const envConfig = parsedEnv.data;
export default envConfig;
