import { useState, useEffect } from 'react';
import { User, Search, MessageSquare, CheckCircle, MinusCircle, Clock, AlertCircle, Filter, Trash2, MessageCircle, ThumbsUp, ThumbsDown, Minus, BarChart3, Globe, Languages, RefreshCw, AlertTriangle, TrendingUp, Activity, Zap, Brain, Target, Calendar, Users } from 'lucide-react';

const extractProblemTypes = (comments) => {
  const problemCounts = {};
  
  if (!comments || !Array.isArray(comments)) return {};
  
  comments.forEach(comment => {
    if (comment.problem_type && 
        comment.problem_type !== 'N/A' && 
        comment.problem_type !== 'nan' && 
        comment.problem_type !== 'null' &&
        comment.sentiment === 'negative') {
      
      if (!problemCounts[comment.problem_type]) {
        problemCounts[comment.problem_type] = {
          negative: 0,
          total: 0
        };
      }
      problemCounts[comment.problem_type].negative += 1;
      problemCounts[comment.problem_type].total += 1;
    }
  });
  
  return problemCounts;
};

const DashboardComponent = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
      avgConfidence: 0
    },
    problem_types: {},
    source_stats: {},
    annotation_comparison: {},
    comments: [],
    loading: true,
    error: null
  });

  const [selectedLanguage, setSelectedLanguage] = useState('both');

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      const response = await fetch('http://127.0.0.1:5000/api/dashboard-stats');
      const data = await response.json();
      
      if (response.ok) {
        setDashboardData({
                  stats: data.stats,          
                  comments: data.comments,     
                  modelInfo: data.model_info,  
                  problem_types: data.problem_types,
                  loading: false,
                  error: null,
                  success: true
                });
                
                console.log('📊 Dashboard structuré:')
                console.log('  📈 Stats:', data.stats)
                console.log('  💬 Commentaires:', data.comments?.length || 0)
                console.log('  🤖 Modèle:', data.model_info?.type)
      } else {
        throw new Error(data.error || 'Erreur de chargement');
      }
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

const { stats, comments, problem_types, loading, error, success } = dashboardData;

const getSentimentConfig = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return {
          color: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        };
      case 'negative':
        return {
          color: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        };
      case 'neutral':
        return {
          color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: <MinusCircle className="w-4 h-4 text-yellow-600" />,
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: <MessageSquare className="w-4 h-4 text-gray-600" />,
        };
    }
  };

  const getProfileIcon = (comment) => {
    if (comment.source === 'user_input') return <User className="w-5 h-5" />;
    if (comment.source === 'sample_data') return <User className="w-5 h-5" />;
    return <User className="w-6 h-6" />;
  };

  const getProblemTypeColor = (type) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = Object.keys(problem_types).indexOf(type) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SentimentIQ analyse vos données
              </h3>
              <p className="text-gray-600">Chargement du tableau de bord Algérie Télécom...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-red-600 mb-2">Erreur de connexion</h3>
          <p className="text-red-500 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Réessayer</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec gradient Algérie Télécom */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-2xl shadow-2xl">
        {/* Motifs de fond */}
        <div className="absolute inset-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white opacity-5 rounded-full"></div>
        </div>
        
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Tableau de Bord SentimentIQ
              </h1>
              <p className="text-blue-100 text-lg">
                Analyse intelligente des commentaires • Algérie Télécom
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-1">
                  <Target className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Haute précision</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Sélecteur de langue premium */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-white bg-opacity-20 border border-white border-opacity-30 text-white rounded-xl px-4 py-3 pr-10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <option value="both" className="text-gray-800">🌐 Tout afficher</option>
                  <option value="french" className="text-gray-800">🇫🇷 Français</option>
                  <option value="arabic" className="text-gray-800">🇩🇿 العربية</option>
                </select>
                <Languages className="absolute right-3 top-3.5 w-5 h-5 text-white pointer-events-none" />
              </div>
            
              <button
                onClick={loadDashboardData}
                className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques principales premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-blue-600 font-medium">Total</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Commentaires Analysés</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 bg-blue-100 rounded-full flex-1">
                  <div className="h-2 bg-blue-500 rounded-full w-full"></div>
                </div>
                <span className="text-xs text-blue-600 font-medium">100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
                <p className="text-sm text-green-600 font-medium">
                  {stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Commentaires Positifs</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 bg-green-100 rounded-full flex-1">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.total > 0 ? (stats.positive / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ThumbsDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{stats.negative}</p>
                <p className="text-sm text-red-600 font-medium">
                  {stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Commentaires Négatifs</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 bg-red-100 rounded-full flex-1">
                  <div 
                    className="h-2 bg-red-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.total > 0 ? (stats.negative / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Minus className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">{stats.neutral}</p>
                <p className="text-sm text-yellow-600 font-medium">
                  {stats.total > 0 ? Math.round((stats.neutral / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Commentaires Neutres</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 bg-yellow-100 rounded-full flex-1">
                  <div 
                    className="h-2 bg-yellow-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.total > 0 ? (stats.neutral / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <Activity className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques améliorés */}
      {comments && comments.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique en secteurs amélioré */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Répartition des Sentiments</h3>
                <p className="text-gray-500 text-sm">Distribution globale</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Donut chart moderne */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-48 h-48">
                {/* Cercle de base */}
                <div className="absolute inset-0 rounded-full bg-gray-100"></div>
                
                {/* Segments colorés */}
                {(() => {
                  const total = stats.total;
                  if (total === 0) return null;
                  
                  const positivePercentage = (stats.positive / total) * 100;
                  const negativePercentage = (stats.negative / total) * 100;
                  const neutralPercentage = (stats.neutral / total) * 100;
                  
                  let cumulativeAngle = 0;
                  const segments = [
                    { percentage: positivePercentage, color: '#10b981', label: 'Positif' },
                    { percentage: negativePercentage, color: '#ef4444', label: 'Négatif' },
                    { percentage: neutralPercentage, color: '#f59e0b', label: 'Neutre' }
                  ];
                  
                  return (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      {segments.map((segment, index) => {
                        const startAngle = cumulativeAngle;
                        const endAngle = cumulativeAngle + (segment.percentage / 100) * 360;
                        cumulativeAngle = endAngle;
                        
                        if (segment.percentage === 0) return null;
                        
                        return (
                          <div
                            key={index}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(${segment.color} ${startAngle}deg ${endAngle}deg, transparent ${endAngle}deg)`
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  );
                })()}
                
                {/* Centre avec statistiques */}
                <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
            
            {/* Légende moderne */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="font-medium text-green-800">Positifs</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{stats.positive}</div>
                  <div className="text-xs text-green-600">
                    {stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="font-medium text-red-800">Négatifs</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">{stats.negative}</div>
                  <div className="text-xs text-red-600">
                    {stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="font-medium text-yellow-800">Neutres</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">{stats.neutral}</div>
                  <div className="text-xs text-yellow-600">
                    {stats.total > 0 ? Math.round((stats.neutral / stats.total) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Histogramme des problèmes amélioré */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:col-span-2 border border-gray-100">
            <div className="flex items-center justify-between mb-16">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Analyse des Problèmes</h3>
                <p className="text-gray-500 text-sm">Types de problèmes identifiés</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div className="relative h-80 flex items-end justify-center space-x-2 pb-8">
              {Object.entries(problem_types)
                .sort(([,a], [,b]) => b.negative - a.negative)
                .slice(0, 8) // Limiter à 8 pour une meilleure lisibilité
                .map(([type, data], index) => {
                  const maxValue = Math.max(...Object.values(problem_types).map(p => p.negative));
                  const heightPercentage = maxValue > 0 ? (data.negative / maxValue) * 100 : 0;
                  
                  let barColor;
                  if (data.negative >= 40) {
                    barColor = 'from-red-600 to-red-700';
                  } else if (data.negative >= 25) {
                    barColor = 'from-orange-600 to-orange-700';
                  } else if (data.negative >= 10) {
                    barColor = 'from-yellow-600 to-yellow-700';
                  } else if (data.negative >= 5) {
                    barColor = 'from-blue-600 to-blue-700';
                  } else {
                    barColor = 'from-gray-500 to-gray-600';
                  }
                  
                  return (
                    <div key={type} className="flex flex-col items-center group relative">
                      {/* Tooltip moderne */}
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 scale-95 group-hover:scale-100">
                        <div className="bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl whitespace-nowrap">
                          <div className="font-semibold text-center">{type}</div>
                          <div className="text-gray-300 text-center mt-1">{data.negative} signalement{data.negative > 1 ? 's' : ''}</div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>
                      
                      {/* Valeur au-dessus */}
                      <div className="mb-2 text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {data.negative}
                      </div>
                      
                      {/* Barre avec gradient moderne */}
                      <div 
                        className={`w-16 bg-gradient-to-t ${barColor} transition-all duration-1000 ease-out cursor-pointer rounded-t-lg shadow-lg hover:shadow-xl group-hover:scale-105 relative overflow-hidden`}
                        style={{ 
                          height: `${Math.max(heightPercentage * 2.8, 20)}px`,
                        }}
                      >
                        {/* Effet de brillance au hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Label en bas */}
                      <div className="mt-2 text-xs font-medium text-gray-600 text-center max-w-20 leading-tight">
                        {type.length > 12 ? `${type.substring(0, 10)}...` : type}
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {/* Légende des niveaux */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                <div className="w-3 h-3 bg-gradient-to-br from-red-600 to-red-700 rounded"></div>
                <span className="text-red-700 font-medium">Critique (≥40)</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                <div className="w-3 h-3 bg-gradient-to-br from-orange-600 to-orange-700 rounded"></div>
                <span className="text-orange-700 font-medium">Élevé (25-39)</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-3 h-3 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded"></div>
                <span className="text-yellow-700 font-medium">Modéré (10-24)</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded"></div>
                <span className="text-blue-700 font-medium">Faible (5-9)</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded"></div>
                <span className="text-gray-700 font-medium">Minimal (1-4)</span>
              </div>
            </div>
            
            {/* Résumé statistique */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.max(...Object.values(problem_types).map(p => p.negative))}
                </div>
                <div className="text-sm text-blue-700 font-medium">Plus fréquent</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
                <div className="text-sm text-red-700 font-medium">Total problèmes</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.values(problem_types).filter(p => p.negative >= 25).length}
                </div>
                <div className="text-sm text-orange-700 font-medium">Priorité haute</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(problem_types).length}
                </div>
                <div className="text-sm text-green-700 font-medium">Types identifiés</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Section commentaires modernisée */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* En-tête premium */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Commentaires Récents</h3>
                <p className="text-gray-600 text-sm">Analyse des retours clients</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium text-sm">
                  {comments.length} commentaire{comments.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des commentaires premium */}
        <div className="divide-y divide-gray-100">
          {comments.length > 0 ? (
            comments.slice(0, 10).map((comment, index) => {
              const sentimentConfig = getSentimentConfig(comment.sentiment);
              
              return (
                <div key={comment.id} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300 group">
                  <div className="flex space-x-6">
                    {/* Avatar premium */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white shadow-lg">
                          {getProfileIcon(comment)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          {sentimentConfig.icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Contenu principal premium */}
                    <div className="flex-1 min-w-0">
                      {/* En-tête du commentaire */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-sm font-semibold border ${sentimentConfig.color}`}>
                            {sentimentConfig.icon}
                            <span>
                              {comment.sentiment === 'positive' ? 'Positif' : 
                               comment.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                            </span>
                          </span>
                          
                          {comment.problem_type && comment.problem_type !== 'N/A' && (
                            <span className="inline-flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-xl border border-orange-200 text-sm font-medium">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="capitalize">{comment.problem_type}</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Commentaire #{index + 1}</span>
                        </div>
                      </div>

                      {/* Contenu bilingue premium */}
                      <div className="space-y-4 mb-6">
                        {comment.text_arabic && (selectedLanguage === 'arabic' || selectedLanguage === 'both') && (
                          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 group-hover:shadow-md transition-shadow">
                            <div className="absolute top-4 left-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-blue-800">Text original</span>
                              </div>
                            </div>
                            <div className="mt-8">
                              <p className="text-gray-800 text-right leading-relaxed text-lg" dir="rtl">
                                {comment.text_arabic}
                              </p>
                            </div>
                           
                          </div>
                        )}
                        
                        {comment.text_french && (selectedLanguage === 'french' || selectedLanguage === 'both') && (
                          <div className="relative bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 group-hover:shadow-md transition-shadow">
                            <div className="absolute top-4 left-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-green-800">Traduction française</span>
                              </div>
                            </div>
                            <div className="mt-8">
                              <p className="text-gray-800 leading-relaxed text-lg">
                                {comment.text_french}
                              </p>
                            </div>
                            <div className="absolute top-4 right-4">
                              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">FR</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions et métadonnées */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-400">
                          Analysé par SentimentIQ • Algérie Télécom
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Aucun commentaire disponible</h4>
              <p className="text-gray-500 max-w-md mx-auto">
                Les commentaires analysés apparaîtront ici en temps réel. 
                Commencez par importer ou analyser des données.
              </p>
              <button className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <Plus className="w-5 h-5" />
                <span>Analyser des commentaires</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default DashboardComponent;