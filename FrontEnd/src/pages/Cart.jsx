import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, totalPrice } = useContext(StoreContext);
  const navigate = useNavigate();
  return (
    <div className="w-full mb-5 h-[100%]  mx-auto ">
      <ul className="flex  items-center justify-around border-none  my-8 shadow-md rounded-sm py-2 bg-gray-100 md:font-semibold text-sm md:text-lg">
        <li className="flex-1 text-center">Product</li>
        <li className="flex-1 text-center">Name</li>
        <li className="flex-1 text-center">Price</li>
        <li className="flex-1 text-center">Quantity</li>
        <li className="flex-1 text-center">Subtotal</li>
        <li className="flex-1 text-center">Remove</li>
      </ul>
      {cart.map((item, index) => (
        <ul
          key={index}
          className="flex h-24 text-sm md:text-lg items-center justify-around border-none  my-8 shadow-md "
        >
          <li className="flex-1 text-center">
            <img src={item.image} alt="" className="w-20 mx-auto" />
          </li>
          <li className="flex-1 text-center  font-bold">
            {Math.round(item.newPrice)}$
          </li>
          <li className="flex-1 text-center font-semibold ">{item.name}</li>
          <li className="flex-1 text-center font-semibold ">{item.quantity}</li>
          <li className="flex-1 text-center font-semibold ">
            {Math.round(item.newPrice * item.quantity)}
          </li>
          <li
            className="flex-1  text-center text-red-600 font-bold text-2xl cursor-pointer"
            onClick={() => removeFromCart(item.id)}
          >
            X
          </li>
        </ul>
      ))}
      <div className="mt-10 flex flex-col gap-2 shadow-md w-full  p-3 rounded-md">
        <h1 className="text-3xl font-semibold text-gray-800">Cart Total</h1>
        <div className="flex max-md w-full items-center justify-around">
          <p className="font-semibold">subtotal:</p>
          <p className="font-semibold">${totalPrice}</p>
        </div>
        <hr className=" w-full h-1 border-gray-500 my-1 " />

        <div className="flex  w-full items-center justify-around">
          <p className="font-semibold">Shipping:</p>
          <p className="font-semibold">Free</p>
        </div>
        <hr className=" w-full h-1 border-gray-500 my-1 " />

        <div className="flex max-md w-full items-center justify-around">
          <p className="font-semibold">Total:</p>
          <p className="font-semibold">${totalPrice}</p>
        </div>
        <hr className=" w-full h-1 border-gray-500 my-1 " />
      </div>
      <button
        onClick={() => navigate("/checkout")}
        className="flex text-white cursor-pointer items-center justify-center my-8 py-3 px-2 rounded-md bg-[#DB4444]"
      >
        PROCEED TO CHECKOUT
      </button>
    </div>
  );
};

export default Cart;
