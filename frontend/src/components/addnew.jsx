import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu, addMenuItem, deleteMenuItem } from "../redux/menuSlice";
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.menu);
  const cart = useSelector((state) => state.cart.items);

  const [newItem, setNewItem] = useState({ name: "", category: "", price: "", image: null });

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const handleAdd = () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("category", newItem.category);
    formData.append("price", newItem.price);
    formData.append("image", newItem.image);

    dispatch(addMenuItem(formData));
    setNewItem({ name: "", category: "", price: "", image: null });
    navigate("/menu");
  };

  if (loading) return <p className="text-center text-lg font-semibold text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-lg font-semibold text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Menu</h1>

      {/* Add New Item Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Name" 
            value={newItem.name} 
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
            className="border p-3 rounded-md focus:ring focus:ring-green-300"
          />
          <input 
            type="text" 
            placeholder="Category" 
            value={newItem.category} 
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} 
            className="border p-3 rounded-md focus:ring focus:ring-green-300"
          />
          <input 
            type="number" 
            placeholder="Price" 
            value={newItem.price} 
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} 
            className="border p-3 rounded-md focus:ring focus:ring-green-300"
          />
          <input 
            type="file" 
            onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })} 
            className="border p-3 rounded-md focus:ring focus:ring-green-300"
          />
        </div>
        <button 
          onClick={handleAdd} 
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md transition-all"
        >
          Add Item
        </button>
      </div>

    </div>
  );
};

export default MenuPage;


