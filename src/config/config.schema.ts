import * as Joi from 'joi';
import { EnvParams } from '@app/shared/enums';

export const configSchema = Joi.object<typeof EnvParams>({
  HOST: Joi.string().hostname().optional().default('localhost'),
  PORT: Joi.number().port().optional().default(9180),
  SQLITE_DB: Joi.string().optional().default('.db/forest.sqlite'),
  CLIENT_URL: Joi.string().uri().required(),
});
