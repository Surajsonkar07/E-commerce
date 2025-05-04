import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';


const Cart = () => {
  const { cart ,removeFromCart } = useContext(StoreContext);
  const navigate=useNavigate();
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <ul className='flex  items-center justify-around border-none'>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      cart
    </div>
  )
}

export default Cart
