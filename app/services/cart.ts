import instance from "./customize-axios";

export const fetchUserCart = async (userId: number) => {
  const { data } = await instance.get(`/carts/${userId}`);
  return data;
};

export const createOrUpdateCartItem = async (payload: {
  userId: number;
  variantId: number;
  quantity: number;
  price: number;
}) => {
  const { data } = await instance.post("/carts/update", payload);
  return data;
};

export const removeCartItem = async (payload: {
  userId: number;
  variantId: number;
}) => {
  const { data } = await instance.delete(
    `/carts/${payload.userId}/${payload.variantId}`
  );
  return data;
};
