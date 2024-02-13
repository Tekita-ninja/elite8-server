import slugify from 'slugify';
export const createSlug = (text: string) => {
  return slugify(text, {
    lower: true,
    replacement: '-',
  });
};
export const createUniqueSlug = (text: string) => {
  const slug = createSlug(text);
  return `${slug}-${Date.now()}`;
};
