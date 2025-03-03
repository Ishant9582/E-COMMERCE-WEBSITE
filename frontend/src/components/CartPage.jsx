import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { placeOrder } from "../redux/orderSlice";

const CartPage = () => {
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // Handle Place Order button click
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
        menuItem: item._id,  // Using correct menu item ID
        quantity: item.quantity,
      })),
      status: "Complete" ,
    };

    dispatch(placeOrder(orderData));  // Dispatch the order with userId
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-lg">Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="py-4 px-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain rounded-md" 
                    />
                  </td>
                  <td className="py-4 px-4">{item.name}</td>
                  <td className="py-4 px-4">${item.price}</td>
                  <td className="py-4 px-4">{item.quantity}</td>
                  <td className="py-4 px-4 text-gray-500">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <Link
          to="/menu"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Back to Menu
        </Link>

        <button
          onClick={handlePlaceOrder}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;
