import React, { useState, useEffect } from 'react';
import { loginUser, getUser, User } from '../api/userApi';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import logo from '../assets/pictures/logo.jpg';

type LoginModalProps = {
  // onSubmit receives the logged in user for further actions
  onSubmit: (user: User) => void;
  onBack?: () => void;
};

export default function LoginModal({ onSubmit, onBack }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission by calling the login API endpoint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      // Call the login endpoint with the provided credentials
      const response = await loginUser({ email, password });
      const accessToken = response?.data?.access_token;
      const userId = response?.data?.user?.id; 

      if (!accessToken || !userId) {
        throw new Error('Identifiants invalides');
      }

      const userResponse = await getUser(userId);
      const user: User = userResponse?.data;

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // If credentials are valid, call onSubmit with the found user
      onSubmit(user);
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 animate-gradient-shift z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-300/30 rounded-full blur-2xl animate-morph"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-green-600/15 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      

             {/* Login Form */}
       <div className="relative bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md mx-4 animate-fade-in">
         {/* Back Button */}
         {onBack && (
           <button
             onClick={onBack}
             className="absolute top-4 left-4 text-green-700 hover:text-green-800 transition-colors duration-300 p-2 rounded-lg hover:bg-green-50"
             aria-label="Retour"
           >
             <FaArrowLeft className="text-lg" />
           </button>
         )}
        {/* Logo and Header */}
        <div className="text-center mb-8">
                     <div className="flex justify-center mb-4">
             <img src={logo} alt="La Crème Rit" className="h-12 sm:h-16 w-auto" />
           </div>
           <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-800 to-green-700 bg-clip-text text-transparent mb-2">
             Connexion
           </h2>
           <p className="text-gray-600 text-xs sm:text-sm">
             Accédez à votre espace de gestion
           </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
            {errorMessage}
          </div>
        )}

                 {/* Login Form */}
         <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Email Field */}
          <div className="relative">
                         <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
               Adresse email
             </label>
             <div className="relative">
               <FaEnvelope className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-green-700" />
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-green-600 rounded-xl focus:border-green-800 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                                  placeholder="Votre adresse email"
                 required
               />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
                         <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
               Mot de passe
             </label>
             <div className="relative">
               <FaLock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-green-700" />
               <input
                 type={showPassword ? "text" : "password"}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border border-green-600 rounded-xl focus:border-green-800 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                 placeholder="Votre mot de passe"
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-green-700 hover:text-green-800 transition-colors duration-300"
               >
                 {showPassword ? <FaEyeSlash /> : <FaEye />}
               </button>
            </div>
          </div>

          {/* Submit Button */}
                     <button 
             type="submit" 
             disabled={isLoading}
             className="w-full bg-gradient-to-r from-green-800 to-green-700 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
           >
            {isLoading ? (
              <div className="flex items-center justify-center">
                                 <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                Connexion en cours...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        
      </div>
    </div>
  );
}