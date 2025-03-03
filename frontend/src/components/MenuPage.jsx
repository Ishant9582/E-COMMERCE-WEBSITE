import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu, addMenuItem, deleteMenuItem } from "../redux/menuSlice";
import { addToCart, removeFromCart,removeAllFromCart } from "../redux/cartSlice";
import { logout } from "../redux/authSlice";
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


  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleAdd = () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("category", newItem.category);
    formData.append("price", newItem.price);
    formData.append("image", newItem.image);

    dispatch(addMenuItem(formData));
    setNewItem({ name: "", category: "", price: "", image: null });
  };

  const handleDelete = (id) => {
    dispatch(deleteMenuItem(id));
    dispatch(removeAllFromCart(id));
  };

  const getCartQuantity = (id) => {
    const item = cart.find((cartItem) => cartItem._id === id);
    return item ? item.quantity : 0;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <button
        onClick={() => navigate("/cart")}
        className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        View Cart
      </button>
      <h1 className="text-2xl font-bold mb-15 mt-10 ml-200">Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item._id} className="border rounded-lg p-4 shadow-md flex flex-col items-center">
            <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-md mb-4" />
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">{item.category}</p>
            <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
            <div className="mt-2 flex space-x-2">
              <button onClick={() => navigate(`/edit/${item._id}`)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
            </div>
            <div className="mt-2 flex space-x-2 items-center">
              <button onClick={() => handleRemoveFromCart(item._id)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">-</button>
              <span className="text-lg">{getCartQuantity(item._id)}</span>
              <button onClick={() => handleAddToCart(item)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;









