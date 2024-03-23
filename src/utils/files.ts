// import * as path from 'path';
export const customFileName = (filename: string) => {
  const DATE = Date.now();
  return `${DATE}-${filename}`;
};
