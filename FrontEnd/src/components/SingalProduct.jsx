import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext.jsx";

const SingalProduct = ({
  id,
  name,
  rating,
  oldPrice,
  newPrice,
  discount,
  number,
  image,
}) => {
  const { addToCart, addToFavourite, removeFromFavourite, favourites } =
    useContext(StoreContext);

    let isFavourite = favourites.some((p) => p.id === id);

    const handleFavourite = (product) => {
      if (isFavourite) {
    
        removeFromFavourite({ id });
      } else {
        addToFavourite({id,name,newPrice,image,oldPrice,discount});
      }
    };
  return (
    <div className="w-[300px] shadow-xl h-auto p-1 rounded-md mt-6 border border-gray-100">
      <div className=" bg-[#F5F5F5] w-full h-[300px] rounded-md p-5">
        <div className="flex item-center justify-between px-2">
          <p className="px-3 py-1 bg-[#DB4444] text-white rounded-md">
            {discount}%
          </p>
          <div
            onClick={handleFavourite}
            className="bg-white  text-black rounded-full cursor-pointer"
          >
            {isFavourite?
             (
              <img
                src={assets.red_heart}
                className="w-7 h-7 bg-[#F5F5F5] cursor-pointer"
                alt=""
              />
            ) : (
              <img
                src={assets.wish}
                className="w-7 h-6 cursor-pointer"
                alt=""
              />
            )}
          </div>
        </div>
        <div>
          <img
            src={image}
            alt=""
            className=" w-56 flex items-center justify-center mt-[5%] cursor-pointer transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
      <button
        onClick={() => addToCart({ id, name, newPrice, image })}
        className="bg-black text-white px-8 py-2 w-full flex items-center justify-center  cursor-pointer"
      >
        Add TO Cart
      </button>
      <h1 className=" text-2xl text-gray-800 font-semibold mt-2">{name} </h1>
      <div className="flex gap-5 my-4">
        <p className=" text-red-500 text-lg">${newPrice}</p>
        <p className=" text-gray-400 text-lg line-through">${oldPrice}</p>
      </div>
      <div>
        <img src={rating} alt="" />
        <p>{number}</p>
      </div>
    </div>
  );
};

export default SingalProduct;
