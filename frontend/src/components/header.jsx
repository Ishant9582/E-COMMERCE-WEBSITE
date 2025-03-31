import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="self-center text-2xl font-semibold text-gray-900">
            Flowbite
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
        >
          <FaBars className="w-6 h-6" />
        </button>

        {/* Navigation Links */}
        <div className={`w-full md:flex md:w-auto ${isOpen ? "block" : "hidden"}`}>
          <ul className="font-medium flex flex-col md:flex-row md:space-x-6 bg-white md:bg-transparent p-4 md:p-0">
            <li><Link to="/" className="block py-2 px-4 hover:text-blue-600">Home</Link></li>
            <li><Link to="/about" className="block py-2 px-4 hover:text-blue-600">About</Link></li>
            <li><Link to="/services" className="block py-2 px-4 hover:text-blue-600">Services</Link></li>
            <li><Link to="/pricing" className="block py-2 px-4 hover:text-blue-600">Pricing</Link></li>
            <li><Link to="/contact" className="block py-2 px-4 hover:text-blue-600">Contact</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
