import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBox, FaChartBar, FaClipboardList, FaHome, FaIndustry, FaShoppingCart, FaTimes, FaUserFriends } from 'react-icons/fa';

// Static navigation items array
const navItems = [
  { icon: <FaHome />, label: "Accueil", to: "/home" },
  { icon: <FaBox />, label: "Produits", to: "/products" },
  { icon: <FaUserFriends />, label: "Client·es professionnel·les", to: "/clients" },
  { icon: <FaIndustry />, label: "Producteurices", to: "/producers" },
  { icon: <FaChartBar />, label: "Historique", to: "/history" },
  { icon: <FaClipboardList />, label: "Inventaire", to: "/inventory" },
  { icon: <FaShoppingCart />, label: "Commandes", to: "/orders" },
];

export default function HeaderMobile() {
  // State to toggle the mobile navigation menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="md:hidden sticky top-0 z-50 bg-white shadow-md px-4 py-3 flex flex-col">
      {/* Top section of the header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">La Crème Rit</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile navigation menu */}
      {isOpen && (
        <>
          <hr className="my-3 border-gray-300" /> {/* Divider */}
          <nav className="flex flex-col gap-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="text-gray-800 text-base flex items-center gap-2"
                onClick={() => setIsOpen(false)} // ferme le menu après navigation
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
