import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MenuPage from "./components/MenuPage";
import EditPage from "./components/EditPage";
import OrderPage from "./components/OrderPage";
import CartPage from "./components/CartPage"
import Loggeduser from "./components/loggeduser"
import Adduser from "./components/addnew"
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/userdetails" element={<Loggeduser />} />
        <Route path="/addnew" element={<Adduser />} />
      </Routes>
    </div>
  );
}

export default App;
