import { MessageSquare, BarChart3, Plus, LogOut, CheckCircle, Brain, Wifi, WifiOff, User, Bell, Settings } from 'lucide-react';

const NavigationComponent = ({ currentView, setCurrentView, onLogout, user, apiStatus = 'connected' }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3},
    { id: 'analyze', label: 'Analyser', icon: Plus },
    { id: 'comments', label: 'Commentaires', icon: MessageSquare}
  ];

  const getStatusIcon = () => {
    switch(apiStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusText = () => {
    switch(apiStatus) {
      case 'connected':
        return 'API Connectée';
      case 'connecting':
        return 'Connexion...';
      case 'disconnected':
        return 'Déconnecté';
      default:
        return 'API Connectée';
    }
  };

  const getStatusColor = () => {
    switch(apiStatus) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'connecting':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <>
      {/* Barre de statut Algérie Télécom */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 h-1"></div>
      
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo et titre améliorés */}
            <div className="flex items-center space-x-4">
              {/* Logos combinés */}
              <div className="flex items-center space-x-2">
                {/* Logo SentimentIQ */}
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  SentimentIQ
                </h1>
                <p className="text-xs text-gray-500 leading-none">• Algérie Télécom •</p>
              </div>
            </div>
            
            {/* Navigation principale */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg transform scale-105' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                    <div className="text-left">
                      <span className="font-semibold text-sm block">{item.label}</span>
                      <span className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                        {item.description}
                      </span>
                    </div>
                    
                    
                  </button>
                );
              })}
            </div>

            {/* Section droite avec statut API et utilisateur */}
            <div className="flex items-center space-x-4">
              {/* Statut API amélioré */}
              <div className={`hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg border text-xs font-medium ${getStatusColor()}`}>
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </div>

              {/* Informations utilisateur améliorées */}
              <div className="hidden sm:flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'utilisateur@at.dz'}</p>
                </div>
              </div>
              
              {/* Bouton de déconnexion amélioré */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-600 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:block font-medium">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Navigation mobile améliorée */}
          <div className="md:hidden border-t pt-4 pb-2">
            <div className="grid grid-cols-3 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-b from-blue-600 to-green-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                    <div className="text-center">
                      <span className="text-sm font-semibold block">{item.label}</span>
                      <span className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Statut API mobile */}
            <div className={`mt-4 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg mx-4 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-xs font-medium">{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* Barre de progression pour les actions en cours */}
        {apiStatus === 'connecting' && (
          <div className="h-1 bg-gray-200">
            <div className="h-full bg-gradient-to-r from-blue-600 to-green-600 animate-pulse"></div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavigationComponent;