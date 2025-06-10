import { useState, useEffect } from "react";
import { FaHome, FaBox, FaIndustry, FaChartBar, FaClipboardList } from "react-icons/fa";

const navItems = [
  { icon: <FaHome />, label: "Accueil", href: "/home" },
  { icon: <FaBox />, label: "Produits", href: "/products" },
  { icon: <FaIndustry />, label: "Producteurices", href: "/producers" },
  { icon: <FaChartBar />, label: "Historique", href: "/products" },
  { icon: <FaClipboardList />, label: "Inventaire", href: "/products" },
];

export default function HeaderDesktop() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`hidden md:flex ${
        isScrolled
          ? "flex-col fixed left-0 top-0 h-full w-56 p-4 bg-white shadow-md z-40"
          : "fixed top-0 left-0 right-0 h-16 px-8 items-center justify-between bg-white shadow-md"
      } transition-all duration-300`}
    >
      {isScrolled ? (
        <>
          <h2 className="text-xl font-bold mb-6">La Crème Rit</h2>
          <nav className="flex flex-col gap-4">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className="flex items-center gap-2 text-gray-700 hover:text-black font-medium">
                {item.icon} {item.label}
              </a>
            ))}
          </nav>
        </>
      ) : (
        <div className="w-full flex justify-between items-center h-full">
          <h1 className="text-xl font-bold">La Crème Rit</h1>
          <nav className="flex gap-6">
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className="flex items-center gap-1 text-gray-700 hover:text-black font-medium">
                {item.icon} {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
