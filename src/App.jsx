import { useState } from 'react';
import { MessageSquare, BarChart3, Plus, LogOut, CheckCircle, Eye, EyeOff } from 'lucide-react'; // ← Ajouter Eye, EyeOff
import * as api from './api/client';
import DashboardComponent from './components/dashboard/DashboardComponent';
import CommentsComponent from './components/comments/CommentsComponent';
import NavigationComponent from './components/layout/NavigationComponent';
import AnalyzeComponent from './components/analyze/AnalyzeComponent';
import AuthComponent from './components/auth/AuthComponent';




// Application principale
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Données des commentaires avec exemples par défaut
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "Ce produit est absolument fantastique! Je le recommande vivement à tous mes amis.",
      sentiment: "positive",
      confidence: 0.95,
      date: "2025-06-15",
      user: "Marie Dubois"
    },
    {
      id: 2,
      text: "Le service client est très décevant, j'ai attendu 2 heures au téléphone sans réponse.",
      sentiment: "negative",
      confidence: 0.87,
      date: "2025-06-14",
      user: "Jean Martin"
    },
    {
      id: 3,
      text: "Le produit est correct, sans plus. Ça fait le travail mais rien d'exceptionnel.",
      sentiment: "neutral",
      confidence: 0.72,
      date: "2025-06-13",
      user: "Sophie Laurent"
    },
    {
      id: 4,
      text: "Excellent rapport qualité-prix! Très satisfait de mon achat, livraison rapide.",
      sentiment: "positive",
      confidence: 0.91,
      date: "2025-06-12",
      user: "Pierre Durand"
    },
    {
      id: 5,
      text: "Interface intuitive et design moderne. Bravo à toute l'équipe de développement!",
      sentiment: "positive",
      confidence: 0.88,
      date: "2025-06-11",
      user: "Lisa Chen"
    }
  ]);

  const handleLogin = (userData) => {
    console.log('Données reçues:', userData); 
    setUser(userData.user); 
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };


  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');

  };


  const handleNewComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  if (!isAuthenticated) {
    return <AuthComponent onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        user={user}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <DashboardComponent /> 
        )}
        
        {currentView === 'analyze' && (
          <AnalyzeComponent onNewComment={handleNewComment} />
        )}
        
        {currentView === 'comments' && (
          <CommentsComponent />
        )}
      </div>
    </div>
  );
}

export default App;