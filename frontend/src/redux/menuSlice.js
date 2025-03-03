

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Fetch all menu items
export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const response = await api.get("/menu");
  return response.data;
});

// Add a new menu item
export const addMenuItem = createAsyncThunk("menu/addMenuItem", async (item) => {
  console.log(Object.fromEntries(item.entries()));
  const response = await api.post("/menu", item);
  
  return response.data;
});

export const updateMenuItem = createAsyncThunk("menu/updateMenuItem", async ({ id, updatedItem }) => {
  console.log(Object.fromEntries(updatedItem.entries()));
  const response = await api.put(`/menu/${id}`, updatedItem // Ensure JSON format
  ) ;
  return response.data;
});



// Delete a menu item
export const deleteMenuItem = createAsyncThunk("menu/deleteMenuItem", async (id) => {
  await api.delete(`/menu/${id}`);
  return id; // Return the id of the deleted item
});

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id); // Assuming _id as identifier
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        // Remove the deleted item from the state using the correct identifier
        state.items = state.items.filter((item) => item._id !== action.payload); // Assuming _id as identifier
      });
  },
});

export default menuSlice.reducer;
