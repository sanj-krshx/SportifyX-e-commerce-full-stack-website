export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const assetUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `${API_BASE_URL}/uploads/${image}`;
};

export const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const getCategoryProducts = async (category) => {
  const products = await fetchJson(`/${category}`);

  return products.map((product) => ({
    ...product,
    category,
  }));
};

export const getBanners = () => fetchJson("/banner");

export const loginUser = (payload) =>
  fetchJson("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const signupUser = (payload) =>
  fetchJson("/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const addCartItem = (payload) =>
  fetchJson("/cart/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getCartItems = (userId) => fetchJson(`/cart/${userId}`);
