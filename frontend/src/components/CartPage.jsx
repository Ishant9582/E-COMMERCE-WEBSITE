import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Product from "./payment.jsx";
import { v4 as uuidv4 } from "uuid";

const CartPage = () => {
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const receiptId = uuidv4();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (totalPrice > 500000) {
      setModalMessage(
        "Your cart total exceeds ₹5,00,000. Please reduce the items or contact support."
      );
      setShowModal(true);
    }
  }, [totalPrice]);

  const closeModal = () => {
    setShowModal(false);
    navigate("/menu"); // Navigate to /menu when modal is closed
  };



  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Notice</h2>
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {!showModal && (
        <>
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
                      <td className="py-4 px-4">Rs {item.price}</td>
                      <td className="py-4 px-4">{item.quantity}</td>
                      <td className="py-4 px-4 text-gray-500">
                        Rs {(item.price * item.quantity).toFixed(2)}
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

          </div>

          {user && cart.length > 0 && (
            <Product
              totalPrice={totalPrice}
              receiptId={receiptId}
              cart={cart}
              user={user}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
