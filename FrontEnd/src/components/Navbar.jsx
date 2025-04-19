import {useState} from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";


const Navbar = () => {
    const [activeMenu, setActiveMenu] = useState("");
  return (
    <nav className=" flex w-full px-4 py-6 top-0 justify-between  items-center z-50 bg-red-200">
      {/* First component */}
      <div>
        <h1 className="text-2xl font-bold">V-Center</h1>
      </div>
      {/* second component */}
      <div>
        <ul className=" hidden items-center md:flex gap-5 text-lg font-normal text-gray-700">
          <Link to="/" onClick={()=>setActiveMenu("Home")} className={`${activeMenu=="Home" ? '  border-b-2 border-red-600': ""}`}>Home</Link>
          <Link to="/about"  onClick={()=>setActiveMenu("About")} className={`${activeMenu=="About" ? ' border-b-2 border-red-600': ""}`}>About</Link>
          <Link to="/contact" onClick={()=>setActiveMenu("Contact")} className={`${activeMenu=="Contact" ? ' border-b-2 border-red-600': ""}`}>Contact</Link>
          <Link to="/signup" onClick={()=>setActiveMenu("Signup")} className={`${activeMenu=="Signup" ? ' border-b-2 border-red-600': ""}`}>SignUp</Link>
        </ul>
      </div>
      {/* third component */}
      <div className="flex items-center gap-5">
        <div className=" relative flex items-center gap-2">
          <input
            type="text"
            className="rounded-lg  outline-none pl-10 py-2 bg-gray-50 w-full"
            placeholder="what are  looking for?"
          />
          <img
            src={assets.search}
            className=" absolute left-3 top-1/2 transform  -translate-y-1/2 cursor-pointer  w-5 h-5"
            alt=""
          />
        </div>
        <Link to="/wish">
          <div>
            <img src={assets.wish} alt="" className="cursor-pointer rounded-full w-13 h-9 p-2 " />
            
          </div>
        </Link>{" "}
        <Link to="/cart">
          <div className="relative flex items-center gap-2">
            <img src={assets.cart} alt="" />
            <div className="absolute -top-2 -right-1 text-center  bg-red-500 rounded-full px-[5px] ">0</div>
          </div>
        </Link>{" "}
        <Link to="/signup">
          <div>
            <img src={assets.user} alt="" className="cursor-pointer rounded-full w-9 h-9 p-1 " />
            
          </div>
        </Link>{" "}
      </div>
    </nav>
  );
};

export default Navbar;
