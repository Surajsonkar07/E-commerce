import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { totalPrice } = useContext(StoreContext);
  const navigate=useNavigate()
  return (
    <div className="w-full py-12 mx-auto flex flex-col md:flex-row">
      <div className=" w-full md:w-[50%] mt-12">
        <h1 className=" text-3xl font-semibold text-gray-800">
          Billing Details
        </h1>
        <form action="" className="max-w-md w-full">
          <div className=" flex flex-col gap-2 my-3">
            <label htmlFor="">Name</label>
            <input
              type="text"
              className=" border-1 outline-none border-gray-500 rounded-md px-8 py-2"
            />
          </div>
          <div className=" flex flex-col gap-2 my-3">
            <label htmlFor="">Company (optaion)</label>
            <input
              type="text"
              className=" border-1 outline-none border-gray-500 rounded-md px-8 py-2"
            />
          </div>
          <div className=" flex flex-col gap-2 my-3">
            <label htmlFor="">Street Number</label>
            <input
              type="text"
              className=" border-1 outline-none border-gray-500 rounded-md px-8 py-2"
            />
          </div>
          <div className=" flex flex-col gap-2 my-3">
            <label htmlFor="">City</label>
            <input
              type="text"
              className=" border-1 outline-none border-gray-500 rounded-md px-8 py-2"
            />
          </div>
          <div className=" flex flex-col gap-2 my-3">
            <label htmlFor="">Phone Number</label>
            <input
              type="text"
              className=" border-1 outline-none border-gray-500 rounded-md px-8 py-2"
            />
          </div>
          <div className=" flex flex-col gap-2 my-3">
            <label htmlFor="">Email</label>
            <input
              type="text"
              className=" border-1 outline-none border-gray-500 rounded-md px-8 py-2"
            />
          </div>
        </form>
      </div>
      <div className="w-[50%] ">
        <div className="mt-10 flex py-5 flex-col gap-2 shadow-md w-full  p-3 rounded-md">
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
        <div className="flex mt-3 ml-2 gap-3">
          <input type="checkbox" />
          <p>Cash On Delivery</p>
        </div>
        <button
          onClick={() => {localStorage.clear();
            toast.success("Order Place successfully")
            navigate("/")}}
          className="flex text-white cursor-pointer items-center justify-center my-8 py-3 px-3 rounded-md bg-[#DB4444]"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
