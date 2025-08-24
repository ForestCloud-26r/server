import * as bcrypt from 'bcrypt';

export const generateHash = async (data: string): Promise<string> => {
  const salt = await bcrypt.genSalt();

  return await bcrypt.hash(data, salt);
};
