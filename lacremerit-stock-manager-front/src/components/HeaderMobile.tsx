import { useState } from 'react';
import { FaBars, FaBox, FaChartBar, FaClipboardList, FaHome, FaIndustry, FaTimes } from 'react-icons/fa';

export default function HeaderMobile() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: <FaHome />, label: "Accueil", href: "/home" },
    { icon: <FaBox />, label: "Produits", href: "/products" },
    { icon: <FaIndustry />, label: "Producteurices", href: "/producers" },
    { icon: <FaChartBar />, label: "Historique", href: "/products" },
    { icon: <FaClipboardList />, label: "Inventaire", href: "/products" },
  ];

  return (
    <header className="md:hidden sticky top-0 z-50 bg-white shadow-md px-4 py-3 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">La Crème Rit</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {isOpen && (
        <>
          <hr className="my-3 border-gray-300" />
          <nav className="flex flex-col gap-3">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className="text-gray-800 text-base flex items-center gap-2">
                {item.icon}
                {item.label}
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
