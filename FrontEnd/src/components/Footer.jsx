import React from "react";

const Footer = () => {
  return (
    <div className="bg-black text-white flex max-sm:flex-col gap-5 items-center justify-around w-full h-auto p-5">
      <div className="flex flex-col gap-4">
        <h1 className=" text-3xl font-semibold text-gray-300">Exclusive</h1>
        <h4 className="text-3xl font-bold">Subscribe</h4>
        <input
          type="text"
          placeholder="Enter your email"
          className="border-2 outline-none border-white rounded-md px-6 py-2"
        />
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-semibold text-white">Support</h1>
        <p className="text-base text-center">111 Bijoy sarani,  Dhaka DH 1515, INDIA</p>
        <p className="text-base text-center">exclusive@gmail.com</p>
        <p className="text-base text-center">+88015-88888-9999</p>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-semibold text-white">Account</h1>
        <p className="text-base text-center">My Account</p>
        <p className="text-base text-center">login/register</p>
        <p className="text-base text-center">cart</p>
      </div>
    </div>
  );
};

export default Footer;
