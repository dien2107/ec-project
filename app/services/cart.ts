import instance from "./customize-axios";

export const fetchUserCart = async (userId: number) => {
  const { data } = await instance.get(`/cart/${userId}`);
  return data;
};

export const createOrUpdateCartItem = async (payload: {
  userId: number;
  variantId: number;
  quantity: number;
  price: number;
}) => {
  const { data } = await instance.post("/cart/update", payload);
  return data;
};

export const removeCartItem = async (payload: {
  userId: number;
  variantId: number;
}) => {
  const { data } = await instance.delete(
    `/cart/${payload.userId}/${payload.variantId}`
  );
  return data;
};
