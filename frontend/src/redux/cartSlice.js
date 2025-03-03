import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item._id !== action.payload);
        }
      }
    },
    removeAllFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    updateCart: (state, action) => {
      const { _id, ...updatedDetails } = action.payload;
      const existingItem = state.items.find(item => item._id === _id);
      if (existingItem) {
        Object.assign(existingItem, updatedDetails); // Update item details, keeping quantity the same
      }
    }
  }
});

export const { addToCart, removeFromCart, removeAllFromCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;
