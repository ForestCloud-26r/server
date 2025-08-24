import { v7 as uuidv7 } from 'uuid';

export const buildFileName = (file: Express.Multer.File): string => {
  return `${uuidv7()}_${file.originalname}`;
};
