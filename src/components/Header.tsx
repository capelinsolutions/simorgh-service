import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getActiveClass = (path: string) =>
    location.pathname === path
      ? "text-[#58C0D7] font-semibold"
      : "text-[rgba(40,40,40,1)] font-normal";

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-white w-full px-5 sm:px-6 lg:px-[120px] py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <img
          src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/11d27c766350de61f072c43b85f52036de041534?placeholderIfAbsent=true"
          alt="Logo"
          className="w-[100px] sm:w-[120px] object-contain"
        />

        {/* Desktop Nav */}
        <nav className="hidden lg:flex bg-[rgba(134,134,134,0.1)] rounded-full items-center gap-2 px-2 py-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded ${getActiveClass("/")}`}
          >
            Home
          </Link>
          <Link
            to="/service-booking"
            className={`px-4 py-2 rounded ${getActiveClass("/service-booking")}`}
          >
            Services
          </Link>
          <Link
            to="/membership"
            className={`px-4 py-2 rounded ${getActiveClass("/membership")}`}
          >
            Pricing
          </Link>
          {[
            { name: "About us", href: "#about" },
            { name: "Contact us", href: "#contact" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-4 py-2 rounded text-[rgba(40,40,40,1)] hover:text-[#58C0D7] transition"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          {loading ? (
            <div className="flex gap-2">
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded" />
              <div className="w-24 h-10 bg-gray-200 animate-pulse rounded" />
            </div>
          ) : user ? (
            <>
              <span className="text-sm text-[rgba(40,40,40,1)]">
                Welcome, {user.email?.split("@")[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/customer")}
                className="text-[#58C0D7] border-[#58C0D7] hover:bg-[#58C0D7] hover:text-white"
              >
                <User className="h-4 w-4 mr-1" /> Dashboard
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="text-[#666] border-[#666] hover:bg-[#666] hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-1" /> Admin
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="px-4 py-2 border border-[#58C0D7] text-[#58C0D7] rounded hover:bg-[#58C0D7] hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 bg-[#58C0D7] text-white rounded hover:bg-[#4aa8c0] transition"
              >
                Register
              </Link>
              <Link
                to="/freelancer-signup"
                className="px-4 py-2 border border-[#666] text-[#666] rounded hover:bg-[#666] hover:text-white transition"
              >
                Join as Cleaner
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <img
            src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/11d27c766350de61f072c43b85f52036de041534?placeholderIfAbsent=true"
            alt="Logo"
            className="w-[100px] object-contain"
          />
          <button onClick={() => setMobileOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className={getActiveClass("/")}>
            Home
          </Link>
          <Link to="/service-booking" onClick={() => setMobileOpen(false)} className={getActiveClass("/service-booking")}>
            Services
          </Link>
          <Link to="/membership" onClick={() => setMobileOpen(false)} className={getActiveClass("/membership")}>
            Pricing
          </Link>
          {[
            { name: "About us", href: "#about" },
            { name: "Contact us", href: "#contact" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-[rgba(40,40,40,1)] hover:text-[#58C0D7]"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t mt-auto">
          {loading ? (
            <div className="flex gap-2">
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded" />
              <div className="w-24 h-10 bg-gray-200 animate-pulse rounded" />
            </div>
          ) : user ? (
            <>
              <p className="mb-3 text-sm text-gray-700">
                Welcome, {user.email?.split("@")[0]}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate("/customer");
                  setMobileOpen(false);
                }}
                className="w-full mb-2 text-[#58C0D7] border-[#58C0D7] hover:bg-[#58C0D7] hover:text-white"
              >
                <User className="h-4 w-4 mr-1" /> Dashboard
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate("/admin");
                    setMobileOpen(false);
                  }}
                  className="w-full mb-2 text-[#666] border-[#666] hover:bg-[#666] hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-1" /> Admin
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="w-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="block w-full mb-2 px-4 py-2 border border-[#58C0D7] text-[#58C0D7] rounded text-center hover:bg-[#58C0D7] hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="block w-full mb-2 px-4 py-2 bg-[#58C0D7] text-white rounded text-center hover:bg-[#4aa8c0]"
              >
                Register
              </Link>
              <Link
                to="/freelancer-signup"
                onClick={() => setMobileOpen(false)}
                className="block w-full px-4 py-2 border border-[#666] text-[#666] rounded text-center hover:bg-[#666] hover:text-white"
              >
                Join as Cleaner
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
