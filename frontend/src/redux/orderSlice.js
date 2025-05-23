import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Fetch all orders
export const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

// Place new order
export const placeOrder = createAsyncThunk("order/placeOrder", async (orderData) => {
  const token = localStorage.getItem("token");
  console.log(orderData) ;
  const response = await api.post("/orders", orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data) ;
  return response.data;
});

// ✅ Update status using `receiptId`
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ receiptId, status }) => {
    const token = localStorage.getItem("token");
    const response = await api.patch(
      `/orders/update-status/${receiptId}`, // assumed backend route
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // expects updated order
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ updateOrderStatus by receiptId
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        // Assuming receiptId is stored in each order item
        const index = state.items.findIndex((order) => order.receiptId === updated.receiptId);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
