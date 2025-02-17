import dotenv from 'dotenv';

dotenv.config();

export default {
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  webhook: {
    verifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
    apiToken: process.env.API_TOKEN,
  },
  server: {
    port: process.env.PORT,
  },
  business: {
    phone: process.env.BUSSINES_PHONE,
  },
  api: {
    version: process.env.API_VERSION,
    baseUrl: process.env.BASE_URL,
  },
  openai: {
    apiKey: process.env.API_KEY_OPENAI
  }
};
