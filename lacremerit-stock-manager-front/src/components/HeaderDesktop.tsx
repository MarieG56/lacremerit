import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // importer Link de react-router-dom
import { FaHome, FaBox, FaIndustry, FaChartBar, FaClipboardList, FaShoppingCart, FaUserFriends } from "react-icons/fa";

// Navigation items with corresponding icons, labels, and links
const navItems = [
  { icon: <FaHome />, label: "Accueil", to: "/home" },
  { icon: <FaBox />, label: "Produits", to: "/products" },
  { icon: <FaUserFriends />, label: "Client·es professionnel·les", to: "/clients" },
  { icon: <FaIndustry />, label: "Producteurices", to: "/producers" },
  { icon: <FaChartBar />, label: "Historique", to: "/history" },
  { icon: <FaClipboardList />, label: "Inventaire", to: "/inventory" },
  { icon: <FaShoppingCart />, label: "Commandes", to: "/orders" },
];

export default function HeaderDesktop() {
  // State to check if the window has been scrolled more than 50px
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Handler to update isScrolled state based on scroll position
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      // Apply different layout classes based on the scroll state
      className={`hidden md:flex ${
        isScrolled
          ? "flex-col fixed left-0 top-0 h-full w-56 p-4 bg-white shadow-md z-40"
          : "fixed top-0 left-0 right-0 h-16 px-8 items-center justify-between bg-white shadow-md"
      } transition-all duration-300`}
    >
      {isScrolled ? (
        <>
          {/* Title for sidebar view */}
          <h2 className="text-xl font-bold mb-6">La Crème Rit</h2>
          <nav className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex items-center gap-2 text-gray-700 hover:text-black font-medium"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </>
      ) : (
        // Header view for non-scrolled state
        <div className="w-full flex justify-between items-center h-full">
          <h1 className="text-xl font-bold">La Crème Rit</h1>
          <nav className="flex gap-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex items-center gap-1 text-gray-700 hover:text-black font-medium"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
