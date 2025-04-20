import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="bg-black w-full mt-2 mx-auto flex flex-col md:flex-row  justify-between items-center h-[35rem] ">
    {/* left side */}
      <div className="text-white items-center justify-center flex flex-col gap-4 p-10 w-[50%]">
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className=" leading-10 font font-semibold  text-2xl text-center md:leading-10 md:text-5xl md:font-bold  text-white">
            UP to 10%
            <br />
            off Voucher
          </h1>
        </div>
        <div className="flex items-center gap-3  justify-center cursor-pointer">
          <button className="text-white cursor-pointer border-b-2 border-white">Buy Now</button>{" "}
          <img src={assets.right_arrow} alt="" />
        </div>
      </div>
      {/* right side */}
      <div className="md:w-[50%] w-full">
        <img src={assets.hero} alt="" />
      </div>
    </div>
  );
};

export default Hero;
