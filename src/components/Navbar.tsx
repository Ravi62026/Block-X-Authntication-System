import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, LogOut, Users, Settings } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";

const Navbar = () => {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const navLinks = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/dashboard", icon: Users, label: "Dashboard" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem("walletInfo");
    localStorage.removeItem("address");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between w-full p-4 backdrop-blur-xl shadow-lg shadow-green-300/30 bg-gradient-to-r from-green-500 to-blue-600 rounded-b-3xl">
      {/* Logo Section */}
      <div className="flex gap-3 items-center">
        <img
          src="/shield.png"
          width={50}
          alt="logo"
          className="animate-pulse-slow"
        />
        <h2 className="text-4xl font-semibold text-white tracking-tight hover:text-green-300 transition-all duration-300">
          Block-X AUTH
        </h2>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
              activeLink === link.path
                ? "bg-white/20 text-white"
                : "text-green-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <link.icon size={20} />
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        ))}

        {/* Connect/Disconnect Wallet */}
        <div className="relative group">
          {isConnected ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all"
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg border border-green-300/30 overflow-hidden">
                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-300 hover:bg-white/20 transition-all"
                  >
                    <LogOut size={16} />
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <w3m-button className="px-6 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
