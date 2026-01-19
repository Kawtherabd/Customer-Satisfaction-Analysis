import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, MessageCircle, ThumbsUp, ThumbsDown, Minus, BarChart3, Globe, Languages, ChevronLeft, ChevronRight, Eye, EyeOff, TrendingUp, TrendingDown, Activity, Users, Clock, Brain, Shield, Star, AlertTriangle, Archive, RefreshCw } from 'lucide-react';

const CommentsManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [filterProblemType, setFilterProblemType] = useState('all');
  const [problemTypes, setProblemTypes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    avgConfidence: 0
  });
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });

  useEffect(() => {
    fetchStats();
    fetchProblemTypes();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [pagination.current_page, searchTerm, filterSentiment, filterProblemType]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/comments/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
        search: searchTerm,
        sentiment: filterSentiment,
        problem_type: filterProblemType
      });

      const response = await fetch(`http://localhost:5000/api/comments?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.comments);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProblemTypes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/problem-types');
      const data = await response.json();
      if (data.success) {
        setProblemTypes(data.problem_types);
      }
    } catch (error) {
      console.error('Erreur chargement types de problèmes:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/comments/delete/${commentId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        fetchComments();
        fetchStats();
        
        if (data.type === 'csv_hidden') {
          alert('Commentaire masqué (le fichier CSV original est préservé)');
        } else {
          alert('Commentaire supprimé avec succès');
        }
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const handleFilterChange = (filterType, value) => {
    setPagination(prev => ({ ...prev, current_page: 1 }));
    
    if (filterType === 'sentiment') {
      setFilterSentiment(value);
      if (value !== 'negative') {
        setFilterProblemType('all');
      }
    } else if (filterType === 'problemType') {
      setFilterProblemType(value);
    } else if (filterType === 'search') {
      setSearchTerm(value);
    }
  };

  const toggleExpandComment = (commentId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const filteredComments = comments;

  const getSentimentConfig = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return {
          color: 'text-green-700 bg-green-50 border-green-200',
          icon: <ThumbsUp className="w-4 h-4" />,
          emoji: '😊',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-600'
        };
      case 'negative':
        return {
          color: 'text-red-700 bg-red-50 border-red-200',
          icon: <ThumbsDown className="w-4 h-4" />,
          emoji: '😞',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-600'
        };
      case 'neutral':
        return {
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          icon: <Minus className="w-4 h-4" />,
          emoji: '😐',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-600'
        };
      default:
        return {
          color: 'text-gray-700 bg-gray-50 border-gray-200',
          icon: <MessageCircle className="w-4 h-4" />,
          emoji: '🤔',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-600'
        };
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-blue-500';
    if (confidence >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            SentimentIQ charge vos commentaires
          </h3>
          <p className="text-gray-600">Préparation de l'interface Algérie Télécom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* En-tête premium avec gradient Algérie Télécom */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-3xl shadow-2xl">
          {/* Motifs de fond */}
          <div className="absolute inset-0">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white opacity-5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Gestion des Commentaires
                </h1>
                <p className="text-blue-100 text-lg">
                  Interface d'administration • SentimentIQ • Algérie Télécom
                </p>
              </div>
              
              <div className="flex flex-col items-end space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-center bg-white bg-opacity-20 rounded-xl px-4 py-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                    <div className="text-blue-100 text-sm">Total</div>
                  </div>
                  <div className="text-center bg-white bg-opacity-20 rounded-xl px-4 py-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-white">{pagination.total_pages}</div>
                    <div className="text-blue-100 text-sm">Pages</div>
                  </div>
                </div>
                <button
                  onClick={() => { fetchComments(); fetchStats(); }}
                  className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Commentaires Positifs</p>
                <p className="text-3xl font-bold text-green-600">{stats.positive}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Commentaires Négatifs</p>
                <p className="text-3xl font-bold text-red-600">{stats.negative}</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <ThumbsDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Commentaires Neutres</p>
                <p className="text-3xl font-bold text-amber-600">{stats.neutral}</p>
                <p className="text-xs text-amber-600 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  {stats.total > 0 ? Math.round((stats.neutral / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Minus className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres premium */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filtres et Recherche
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recherche premium */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rechercher dans les commentaires
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tapez votre recherche..."
                    value={searchTerm}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Filtre par sentiment premium */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filtrer par sentiment
                </label>
                <div className="relative">
                  <Activity className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <select
                    value={filterSentiment}
                    onChange={(e) => handleFilterChange('sentiment', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300"
                  >
                    <option value="all">Tous les sentiments</option>
                    <option value="positive">🟢 Positifs uniquement</option>
                    <option value="negative">🔴 Négatifs uniquement</option>
                    <option value="neutral">🟡 Neutres uniquement</option>
                  </select>
                </div>
              </div>
              
              {/* Filtre par type de problème premium */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de problème
                </label>
                <div className="relative">
                  <AlertTriangle className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <select
                    value={filterProblemType}
                    onChange={(e) => handleFilterChange('problemType', e.target.value)}
                    disabled={filterSentiment !== 'negative'}
                    className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300 ${
                      filterSentiment !== 'negative' ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    <option value="all"> Tous les types</option>
                    {problemTypes.map(type => (
                      <option key={type} value={type}> {type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {filterSentiment !== 'negative' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start">
                  <Brain className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium text-sm">Information SentimentIQ</p>
                    <p className="text-blue-700 text-sm">
                      Le filtre par type de problème est disponible uniquement pour les commentaires négatifs
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Liste des commentaires premium */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                Commentaires ({filteredComments.length})
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Page {pagination.current_page} / {pagination.total_pages}</span>
              </div>
            </div>
          </div>

          {filteredComments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredComments.map((comment, index) => {
                const sentimentConfig = getSentimentConfig(comment.sentiment);
                const isExpanded = expandedComments.has(comment.id);
                
                return (
                  <div key={comment.id} className="p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300 group">
                    <div className="flex space-x-6">
                      {/* Avatar avec sentiment */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className={`w-14 h-14 rounded-2xl ${sentimentConfig.bgColor} ${sentimentConfig.borderColor} border-2 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            {sentimentConfig.icon}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-xs font-bold">#{index + 1}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Badge de sentiment premium */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${sentimentConfig.color} shadow-sm`}>
                              {sentimentConfig.icon}
                              <span className="capitalize">{comment.sentiment}</span>
                            </span>
                            
                            {comment.problem_type && comment.problem_type !== 'N/A' && (
                              <span className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-2 rounded-xl border border-orange-200 text-sm font-medium">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="capitalize">{comment.problem_type}</span>
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                              title="Supprimer le commentaire"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Texte principal premium */}
                        <div className="mb-6">
                          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 group-hover:shadow-md transition-shadow duration-300">
                            <p className="text-gray-800 text-lg leading-relaxed">
                              "{comment.text_display}"
                            </p>
                          </div>
                        </div>
                        
                        {/* Section traduction premium */}
                        {(comment.text_arabic || comment.text_french) && (
                          <div className="mb-6">
                            <button
                              onClick={() => toggleExpandComment(comment.id)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                            >
                              <Languages className="w-5 h-5" />
                              <span>
                                {isExpanded ? 'Masquer' : 'Afficher'} la traduction
                              </span>
                              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            
                            {isExpanded && (
                              <div className="mt-4 grid grid-cols-1 gap-4">
                                {comment.text_french && (
                                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">FR</span>
                                      </div>
                                      <span className="text-green-800 font-semibold">Traduction française</span>
                                    </div>
                                    <p className="text-gray-800 leading-relaxed">
                                      {comment.text_french}
                                    </p>
                                  </div>
                                )}
                                
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Métadonnées premium */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Analysé par SentimentIQ</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4" />
                              <span>Algérie Télécom</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            ID: {comment.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun commentaire trouvé
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                {searchTerm || filterSentiment !== 'all' || filterProblemType !== 'all'
                  ? 'Essayez de modifier vos critères de recherche pour voir plus de résultats' 
                  : 'Commencez par analyser votre premier commentaire avec SentimentIQ'}
              </p>
              <button className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                <Brain className="w-5 h-5" />
                <span>Analyser des commentaires</span>
              </button>
            </div>
          )}
        </div>

        {/* Pagination premium */}
        {pagination.total_pages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">
                    Affichage de <span className="text-blue-600 font-bold">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> à{' '}
                    <span className="text-blue-600 font-bold">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> sur{' '}
                    <span className="text-blue-600 font-bold">{pagination.total}</span> commentaires
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={!pagination.has_prev}
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>
                  
                  {/* Numéros de pages premium */}
                  <div className="flex items-center space-x-2">
                    {[...Array(pagination.total_pages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isCurrentPage = pageNum === pagination.current_page;
                      
                      // Afficher seulement quelques pages autour de la page actuelle
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.total_pages ||
                        (pageNum >= pagination.current_page - 2 && pageNum <= pagination.current_page + 2)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-12 h-12 text-sm font-bold rounded-xl transition-all duration-200 ${
                              isCurrentPage
                                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg scale-110'
                                : 'text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:scale-105'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === pagination.current_page - 3 ||
                        pageNum === pagination.current_page + 3
                      ) {
                        return (
                          <span key={pageNum} className="px-3 text-gray-400 font-bold">
                            ⋯
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={!pagination.has_next}
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Informations supplémentaires */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <Brain className="w-4 h-4" />
                  <span>Données analysées par SentimentIQ</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Technologie Algérie Télécom</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select 
                    value={pagination.per_page}
                    onChange={(e) => setPagination(prev => ({ ...prev, per_page: parseInt(e.target.value), current_page: 1 }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5 par page</option>
                    <option value={10}>10 par page</option>
                    <option value={20}>20 par page</option>
                    <option value={50}>50 par page</option>
                  </select>
                  
                  <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium">Temps réel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer informatif */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Données sécurisées</h4>
                <p className="text-gray-600 text-sm">Vos commentaires sont traités de manière confidentielle</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span>Powered by <span className="font-semibold text-blue-600">SentimentIQ</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-green-600" />
                <span>Technologie <span className="font-semibold text-green-600">Algérie Télécom</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-amber-600">Intelligence Artificielle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsManager;