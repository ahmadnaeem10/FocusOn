import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 8080,
}));
