import { useState } from 'react';
import { MessageSquare, Eye, EyeOff, AlertCircle, Brain, Zap } from 'lucide-react';

const AuthComponent = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const endpoint = showLogin ? '/login' : '/register';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          ...(showLogin ? {} : { name: loginData.email.split('@')[0] })
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Simuler le stockage (localStorage non supporté dans les artifacts)
        console.log('Token stocké:', data.token);
        
        // Appeler la fonction onLogin avec les données utilisateur
        onLogin({
          token: data.token,
          user: data.user
        });
      } else {
        setError(data.error || 'Une erreur s\'est produite');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setShowLogin(!showLogin);
    setError('');
    setLoginData({ email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments de design Algérie Télécom en arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-600 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-600 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-blue-400 rounded-full opacity-5 animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-all duration-300 relative z-10 border border-gray-100">
        {/* En-tête avec logos */}
        <div className="text-center mb-8">
          {/* Logos combinés */}
          <div className="flex items-center justify-center mb-6 space-x-4">
            {/* Logo Algérie Télécom */}
            <div className="w-32 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center p-2 border border-gray-100">
              <img 
                src="/src/assets/Logo_Algérie_Télécom.svg" 
                alt="Algérie Télécom" 
                className="w-full h-full object-contain"
              />
            </div>
            {/* Séparateur */}
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-green-600"></div>
            
            {/* Logo SentimentIQ */}
            <div className="w-32 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Titre avec gradient */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            SentimentIQ
          </h1>
          <p className="text-gray-600 mb-1">
            Powered by Algérie Télécom
          </p>
          <p className="text-sm text-gray-500">
            {showLogin ? 'Accédez à votre tableau de bord' : 'Créez votre compte'}
          </p>
        </div>

        {/* Barre de progression Algérie Télécom */}
        <div className="mb-6">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 animate-pulse"></div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Adresse Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="votre@email.com"
                required
              />
              <div className="absolute right-4 top-4">
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white pr-12"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500 hover:text-blue-600 transition-colors duration-200" 
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} 
              </button>
            </div>
            {!showLogin && (
              <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Minimum 6 caractères</span>
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !loginData.email || !loginData.password}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white py-4 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold text-lg relative overflow-hidden group"
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {loading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>
                  {showLogin ? 'Connexion en cours...' : 'Inscription en cours...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>{showLogin ? 'Se connecter' : "S'inscrire"}</span>
                <Zap className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-center">
            <button
              onClick={toggleMode}
              className="text-blue-600 hover:text-green-600 font-semibold transition-colors duration-300 text-sm"
            >
              {showLogin ? "Nouveau sur SentimentIQ ? Créer un compte" : 'Déjà membre ? Se connecter'}
            </button>
          </div>
          
          {/* Footer Algérie Télécom */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Une solution 
              <span className="text-blue-600 font-semibold"> Algérie Télécom</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;