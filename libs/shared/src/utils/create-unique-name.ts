import { v7 as uuidv7 } from 'uuid';

export const createUniqueName = (name: string): string => {
  return `${uuidv7()}_${name}`;
};
