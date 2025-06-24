import { useState } from 'react';
import { FaBars, FaBox, FaChartBar, FaClipboardList, FaHome, FaIndustry, FaShoppingCart, FaTimes, FaUserFriends } from 'react-icons/fa';

// Static navigation items array
const navItems = [
  { icon: <FaHome />, label: "Accueil", href: "/home" },
  { icon: <FaBox />, label: "Produits", href: "/products" },
  { icon: <FaUserFriends />, label: "Client·es professionnel·es", href: "/clients" },
  { icon: <FaIndustry />, label: "Producteurices", href: "/producers" },
  { icon: <FaChartBar />, label: "Historique", href: "/history" },
  { icon: <FaClipboardList />, label: "Inventaire", href: "/inventory" },
  { icon: <FaShoppingCart />, label: "Commandes", href: "/orders" },
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
              <a
                key={index}
                href={item.href}
                className="text-gray-800 text-base flex items-center gap-2"
              >
                {item.icon} {item.label}
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
