import * as dotenv from 'dotenv';
import * as path from 'path';

const ENV = process.env.NODE_ENV;

const envFile = ENV ? `.env.${ENV}` : '.env';
const envPath = path.resolve(__dirname, `../../${envFile}`);

dotenv.config({
  path: envPath,
  override: true,
});
