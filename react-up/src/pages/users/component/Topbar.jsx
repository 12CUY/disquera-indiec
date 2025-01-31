import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUserAlt,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-black text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:w-72`}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="text-3xl font-bold text-green-500 mb-8">INDIEC</div>

          {/* Menu items */}
          <ul className="space-y-6">
            <li className="hover:bg-green-500 p-3 rounded-md transition-colors">
              <a href="/dashboard2" className="flex items-center gap-3">
                <FaHome size={20} /> Dashboard
              </a>
            </li>
            <li className="hover:bg-green-500 p-3 rounded-md transition-colors">
              <a href="/Catalogo" className="flex items-center gap-3">
                <GrCatalog size={20} /> Catalogo
              </a>
            </li>
            <li className="hover:bg-green-500 p-3 rounded-md transition-colors">
              <a href="/Compras" className="flex items-center gap-3">
                <FaShoppingCart size={20} /> Compras
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-72 bg-gradient-to-r from-green-500">
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-gradient-to-r from-black to-green-500 shadow-md p-4">
          <div></div> {/* Empty for alignment */}
          <div className="flex items-center space-x-4 md:flex-row flex-col">
            {/* User Info with Dropdown */}
            <div className="relative">
              <div
                className="flex items-center space-x-2 "
                onClick={toggleDropdown}
              >
                <img
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-black hover:shadow-lg"
                  style={{
                    backgroundImage: "url('/musicaa.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-4 text-sm">
                  <ul className="space-y-2">
                    <h5 className="font-bold">Billi</h5>
                    <li className="flex items-center gap-2">
                      <FaUserAlt size={16} className="text-gray-600" />
                      <a
                        href="/perfil2"
                        className="text-gray-800 hover:text-green-500"
                      >
                        Perfil
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaSignOutAlt size={16} className="text-gray-600" />
                      <a
                        href="/"
                        className="text-gray-800 hover:text-green-500"
                      >
                        Cerrar sesion
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Notification Button */}
            <div className="relative md:mb-0 mb-2">
              <button
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none"
                onClick={() => setShowNotification(!showNotification)}
              >
                🔔
              </button>
              {showNotification && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-4 text-sm">
                  <p className="font-bold mb-2">Notificaciones</p>
                  <div className="bg-gray-100 p-3 rounded-md">
                    Tienes nuevos eventos listos para ti 🎉
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus:outline-none md:hidden"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
