import { createContext, useMemo, useState, useEffect } from "react";
import { BestProducts, latestProducts, products } from "../assets/assets";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart:", error);
      return [];
    }
  });

  //state for favourites
  const [favourites, setFavourites] = useState(() => {
    try {
      const savedFavourites = localStorage.getItem("favourites");
      return savedFavourites ? JSON.parse(savedFavourites) : [];
    } catch (error) {
      console.error("Error parsing cart:", error);
      return [];
    }
  });

  // Safer localStorage sync
  // useEffect(() => {
  //   try {
  //     localStorage.setItem("cart", JSON.stringify(cart));
  //     console.log(cart);
  //   } catch (error) {
  //     console.error("Error saving cart:", error);
  //   }
  // }, [cart]);

  // add to favourites

  const addToFavourite = (product) => {
    const updatedFavourites = [...favourites, product];
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    toast.success("Product added to favourites");
  };
  // remove from favourites
  const removeFromFavourite = (product) => {
    const updatedFavourites = favourites.filter((p) => p.id !== product.id);
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    toast.success("Product removed from favourites");
  };

  // Stable function references
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let updateCart;
    if (existingItem) {
      updateCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updateCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updateCart);
    localStorage.setItem("cart", JSON.stringify(updateCart));
    console.log(cart);
    

    toast.success("Product added to cart");
  };

  const removeFromCart = (product) => {
    const updateCart = cart.filter((p) => p.id !== product.id);
    setCart(updateCart);
    localStorage.setItem("cart", JSON.stringify(updateCart));

    toast.success("Product removed from cart");
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
      console.log(cart);
    }
    const savedFavourites = localStorage.getItem("favourites");
    if (savedFavourites) {
      setFavourites(JSON.parse(savedFavourites));
    }
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      latestProducts,
      BestProducts,
      products,
      cart,
      addToCart,
      removeFromCart,
      favourites,
      addToFavourite,
      removeFromFavourite,
    }),
    [cart, favourites] // Only update when cart or favourites changes
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
