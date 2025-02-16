import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu, addMenuItem, deleteMenuItem } from "../redux/menuSlice";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.menu);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);

  const [newItem, setNewItem] = useState({ name: "", category: "", price: "", image: null });

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/");
  };

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
    dispatch(removeFromCart(id));
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

      <h1 className="text-2xl font-bold mb-4">Menu</h1>

      {user && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Logged-in User</h2>
          <p><strong>Name:</strong> {user.username}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2">
            Logout
          </button>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="border p-2 mr-2" />
        <input type="text" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="border p-2 mr-2" />
        <input type="number" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="border p-2 mr-2" />
        <input type="file" onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })} className="border p-2 mr-2" />
        <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Add
        </button>
      </div>

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









