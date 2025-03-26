import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MenuPage from "./components/MenuPage";
import EditPage from "./components/EditPage";
import OrderPage from "./components/OrderPage";
import CartPage from "./components/CartPage";
import LoggedUser from "./components/LoggedUser";
import AddUser from "./components/addnew";
import AuthLayout from "./components/authlayout";
import Chat from "./components/Chat";
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/userdetails" element={<LoggedUser />} />
          <Route path="/addnew" element={<AddUser />} />
          <Route path="/chat" element={<Chat/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
