import {config} from "dotenv";

config({path: `.env`});

export const {
  PORT,
  SERVER_URL,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = process.env;
