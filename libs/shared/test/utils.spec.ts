import { buildFileName, extractFilename } from '@app/shared/utils';

describe('Filename', () => {
  const file = {
    originalname: 'my-file.txt',
  } as Express.Multer.File;

  it('Should generate unique filename', () => {
    const filename = buildFileName(file);

    expect(filename).not.toBe(file.originalname);
    expect(filename.split('_')).toHaveLength(2);
  });

  it('Should extract filename from generated', () => {
    const filename = buildFileName(file);
    const extracted = extractFilename(filename);

    expect(extracted).toBe(file.originalname);
  });
});
