import slugify from 'slugify';
export const customFileName = (filename: string) => {
  const DATE = Date.now();
  const newFileName = slugify(filename, {
    lower: true,
    trim: true,
    replacement: '-',
  });
  return `${DATE}-${newFileName}`;
};

export const toFullPath = (filename: string): string => {
  return `${process.env.AWS_S3_URL}/${filename}`;
};
