import React, { useEffect } from 'react';
import { FaBox, FaUsers, FaChartLine, FaBell, FaGlobe, FaFacebook } from 'react-icons/fa';
import logo from '../assets/pictures/logo.jpg';

interface LandingPageProps {
  onShowLogin: () => void;
  showNavbar: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowLogin, showNavbar }) => {

  const handleLoginClick = () => {
    onShowLogin();
  };

  useEffect(() => {
    // Animation d'entrée pour les éléments
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });

    // Observer tous les éléments à animer
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);



    return (
          <div className="flex flex-col min-h-screen">
             {/* Navigation */}
       <nav className={`bg-white/90 backdrop-blur-md border-b border-green-300/50 sticky top-0 z-50 transition-all duration-500 ${
         showNavbar ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-full'
       }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
                         <div className="flex items-center">
               <img src={logo} alt="La Crème Rit" className="h-12 w-auto" />
               <div className="ml-3 text-sm text-green-900 font-medium">Stock Manager</div>
             </div>
            <div className="flex items-center space-x-4">
                             <button
                 onClick={handleLoginClick}
                 className="bg-gradient-to-r from-green-900 to-green-950 text-white px-6 py-2.5 rounded-lg hover:from-green-950 hover:to-green-900 transition-all duration-300 shadow-lg hover:shadow-xl"
               >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </nav>

             {/* Hero Section */}
       <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-100 via-green-200 to-green-300 relative overflow-hidden animate-gradient-shift">
         {/* Animated background elements */}
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-float"></div>
           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
           <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-300/30 rounded-full blur-2xl animate-morph"></div>
           <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-green-600/15 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
         </div>

         
         <div className="max-w-7xl mx-auto text-center">
                      <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-8 leading-tight animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000">
              Gérez votre stock avec
                             <span className="block bg-gradient-to-r from-green-900 to-green-800 bg-clip-text text-transparent animate-pulse">
                 efficacité
               </span>
            </h1>
                        <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000 delay-300">
               La solution complète pour la gestion d'inventaire de votre magasin de producteurs. 
               Optimisez vos opérations avec notre plateforme intuitive et moderne.
             </p>
           <div className="flex justify-center animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000 delay-500">
                            <button
                 onClick={handleLoginClick}
                 className="bg-gradient-to-r from-green-900 to-green-950 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-green-950 hover:to-green-900 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
               >
               Commencer maintenant
             </button>
           </div>
         </div>
       </section>

             {/* Features Section */}
       <section className="py-24 bg-white flex-1 relative overflow-hidden">
         {/* Subtle background animations */}
         <div className="absolute inset-0 overflow-hidden opacity-30">
           <div className="absolute top-20 right-20 w-32 h-32 bg-green-100 rounded-full blur-2xl animate-float"></div>
           <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
         </div>

         
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-20 animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000">
             <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
               Fonctionnalités principales
             </h2>
                                                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                 Tout ce dont vous avez besoin pour gérer efficacement votre magasin de producteurs
               </p>
           </div>
          
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition-all duration-300 border border-green-300/50 animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-700 hover:scale-105 hover:shadow-xl">
               <div className="bg-gradient-to-br from-green-900 to-green-950 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                 <FaBox className="text-white text-2xl" />
               </div>
                                                                                                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Gestion des produits</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Gérez l'inventaire de vos produits laitiers et ceux de vos partenaires locaux
                  </p>
             </div>
            
                         <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition-all duration-300 border border-green-300/50 animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-700 delay-100 hover:scale-105 hover:shadow-xl">
               <div className="bg-gradient-to-br from-green-900 to-green-950 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                 <FaUsers className="text-white text-2xl" />
               </div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-3">Gestion des clients</h3>
                <p className="text-gray-600 leading-relaxed">
                  Gérez vos clients particuliers et professionnels (restaurants, cantines) en un seul endroit
                </p>
             </div>
            
                         <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition-all duration-300 border border-green-300/50 animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-700 delay-200 hover:scale-105 hover:shadow-xl">
               <div className="bg-gradient-to-br from-green-900 to-green-950 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                 <FaChartLine className="text-white text-2xl" />
               </div>
                                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Suivi des commandes</h3>
                 <p className="text-gray-600 leading-relaxed">
                   Créez et suivez vos commandes avec gestion des quantités et livraisons
                 </p>
             </div>
            
                         <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition-all duration-300 border border-green-300/50 animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-700 delay-300 hover:scale-105 hover:shadow-xl">
               <div className="bg-gradient-to-br from-green-900 to-green-950 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                 <FaBell className="text-white text-2xl" />
               </div>
                                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Alertes de stock</h3>
                 <p className="text-gray-600 leading-relaxed">
                   Recevez des notifications automatiques pour les produits en rupture de stock
                 </p>
             </div>
          </div>
        </div>
             </section>

               {/* Footer */}
        <footer className="bg-gray-900 text-white py-4 sm:py-6 animate-on-scroll opacity-0 transform translate-y-8 transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <img src={logo} alt="La Crème Rit" className="h-8 sm:h-10 w-auto" />
                <div className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-400">
                  Stock Manager
                </div>
              </div>
              
              <p className="text-gray-400 text-xs sm:text-sm text-center max-w-xs sm:max-w-none">
                Solution de gestion de stock moderne et efficace pour votre magasin de producteurs
              </p>
              
              <div className="flex space-x-4">
                <a 
                  href="https://la-creme-rit.fr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:scale-110 transform"
                >
                  <FaGlobe className="text-base sm:text-lg" />
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=100057031586904" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:scale-110 transform"
                >
                  <FaFacebook className="text-base sm:text-lg" />
                </a>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default LandingPage;
