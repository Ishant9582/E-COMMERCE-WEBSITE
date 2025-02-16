import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {

  const token = localStorage.getItem("token");
  const response = await api.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data)
  return response.data;
});

export const placeOrder = createAsyncThunk("order/placeOrder", async (orderData) => {
  console.log(orderData) ;
  const token = localStorage.getItem("token");
  const response = await api.post("/orders", orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
