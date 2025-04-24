import React from "react";
import { products } from "../assets/assets";
import SingalProduct from "./SingalProduct";

const Product = () => {
  return (
    <div className=" my-12 w-full">
      <p className="text-red-500 text-center ml-5 font font-semibold text-5xl">
    Our Products
      </p>
      <h2
        className=" text-center text-xl font-semibold md:text-start md:text-3xl
md:font-bold text-gray-800 mt-3"
      >Explore Our Products</h2>
        <div className=" flex gap-2 flex-wrap justify-center items-center w-full h-auto p-5">
        {products.map((product) => {
          return (
            <SingalProduct
              key={product.id}
              image={product.image}
              name={product.name}
              oldPrice={product.oldPrice}
              newPrice={product.newPrice}
              rating={product.rating}
              number={product.number}
              discount={product.discount}
              descriptaion={product.description}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Product;
