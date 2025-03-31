import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu, deleteMenuItem } from "../redux/menuSlice";
import { addToCart, removeFromCart, removeAllFromCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi"; // Chat icon

const MenuPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.menu);
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteMenuItem(id));
    dispatch(removeAllFromCart(id));
  };

  const getCartQuantity = (id) => {
    const item = cart.find((cartItem) => cartItem._id === id);
    return item ? item.quantity : 0;
  };

  if (loading) return <p className="text-center text-lg font-bold mt-20">Loading...</p>;
  if (error) return <p className="text-center text-lg font-bold text-red-500 mt-20">Error: {error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Cart Button */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed top-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg hover:bg-blue-700 transition mt-15"
      >
        <FiShoppingCart className="text-2xl" />
        <span className="font-semibold">Cart</span>
      </button>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-25">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-xl shadow-lg p-3 w-[220px] h-[300px] flex flex-col items-center transform transition duration-300 hover:scale-105"
          >
            {/* Fixed Size Image with Compression */}
            <div className="w-[180px] h-[180px] overflow-hidden flex items-center justify-center bg-gray-200 rounded-lg">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="text-center mt-2">
              <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
            </div>

            {/* Cart Controls */}
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleRemoveFromCart(item._id)}
                className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600 transition"
              >
                -
              </button>
              <span className="text-lg font-bold">{getCartQuantity(item._id)}</span>
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 transition"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => navigate("/chat")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        title="Chat"
      >
        <FiMessageCircle className="text-2xl" />
      </button>
    </div>
  );
};

export default MenuPage;

