// src/components/OrderPlacer.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { placeOrder } from "../redux/orderSlice";

const OrderPlacer = ({ cart, user, status }) => {
  console.log(status);
  const dispatch = useDispatch();

  const handlePlaceOrder = () => {
    if (!user) {
      alert("Please log in to place an order!");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      items: cart.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      })),
      status: "Complete",
    };

    dispatch(placeOrder(orderData));
  };

return (
    <div className="flex justify-end">
        <button
            onClick={handlePlaceOrder}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
            Place Order
        </button>
    </div>
);
};

export default OrderPlacer;
