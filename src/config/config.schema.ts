import * as Joi from 'joi';
import type { EnvParams } from '@app/shared/enums';
import { v7 as uuidv7 } from 'uuid';

export const configSchema = Joi.object<typeof EnvParams>({
  HOST: Joi.string().hostname().optional().default('localhost'),
  PORT: Joi.number().port().optional().default(9180),
  SQLITE_DB: Joi.string().optional().default('.db/forest.sqlite'),
  CLIENT_URL: Joi.string().uri().optional().default('http://localhost:7180'),
  JWT_SECRET: Joi.string().optional().default(uuidv7()),
  JWT_EXPIRES_IN: Joi.string().optional().default('21d'),
  UPLOADS_DEST: Joi.string().optional().default('./uploads'),
});
