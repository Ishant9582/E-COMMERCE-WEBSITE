import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMenuItem, fetchMenu } from "../redux/menuSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateCart } from "../redux/cartSlice";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.menu);
  const { items: cartItems } = useSelector((state) => state.cart); // Get cart items

  const itemToEdit = items.find(item => item._id === id);

  const [editItem, setEditItem] = useState({ name: "", category: "", price: "", image: null });

  useEffect(() => {
    if (itemToEdit) {
      setEditItem({
        name: itemToEdit.name,
        category: itemToEdit.category,
        price: itemToEdit.price,
        image: null
      });
    }
  }, [itemToEdit]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", editItem.name);
    formData.append("category", editItem.category);
    formData.append("price", editItem.price);
    if (editItem.image) formData.append("image", editItem.image);

    await dispatch(updateMenuItem({ id, updatedItem: formData }));
    dispatch(fetchMenu());

    // Check if the item exists in the cart and update it
    const existingCartItem = cartItems.find(item => item._id === id);
    if (existingCartItem) {
      dispatch(updateCart({ _id: id, name: editItem.name, category: editItem.category, price: editItem.price }));
    }

    navigate("/menu");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Menu Item</h1>
      <input type="text" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="border p-2 mb-2" />
      <input type="text" value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} className="border p-2 mb-2" />
      <input type="number" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} className="border p-2 mb-2" />
      <input type="file" onChange={(e) => setEditItem({ ...editItem, image: e.target.files[0] })} className="border p-2 mb-2" />
      <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Update</button>
    </div>
  );
};

export default EditPage;
