const KEY = "recently_viewed_products";
const LIMIT = 8;

export const addRecentlyViewed = (product) => {
  if (!product?._id) return;

  const stored = JSON.parse(sessionStorage.getItem(KEY)) || [];

  // remove duplicate
  const filtered = stored.filter((p) => p._id !== product._id);

  const updated = [product, ...filtered].slice(0, LIMIT);

  sessionStorage.setItem(KEY, JSON.stringify(updated));
};

export const getRecentlyViewed = () => {
  return JSON.parse(sessionStorage.getItem(KEY)) || [];
};
