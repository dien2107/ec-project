import instance from "./customize-axios";

export const ToggleStatus = async (paymentDestinationId: number) => {
  try {
    const response = await instance.patch(
      `/payment-destinations/${paymentDestinationId}/toggle-status`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating payment destination status:", error);
    throw error;
  }
};
