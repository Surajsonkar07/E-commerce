import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Addtofavourite from "./pages/Addtofavourite";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/addtofavourite" element={<Addtofavourite />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
