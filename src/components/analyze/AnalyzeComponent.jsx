import React, { useState } from 'react';
import { 
  Brain, 
  Zap, 
  RotateCcw, 
  Copy, 
  Send, 
  CheckCircle, 
  XCircle, 
  Minus, 
  TrendingUp,
  Clock,
  FileText,
  MessageSquare,
  Target,
  Activity,
  Languages,
  Sparkles,
  Cpu,
  Shield,
  Globe,
  Award,
  Search,
  Star,
  ArrowRight
} from 'lucide-react';

// Composant d'analyse moderne et professionnel avec traduction
const AnalyzeComponent = ({ onNewComment }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API Backend Integration
  const analyzeWithBackend = async (inputText) => {
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'analyse');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'Erreur de connexion au serveur');
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const analysisResult = await analyzeWithBackend(text);
      
      setResult({
        sentiment: analysisResult.sentiment,
        confidence: analysisResult.confidence,
        text: analysisResult.text,
        original_text: analysisResult.original_text || text,
        translated_text: analysisResult.translated_text,
        language_detected: analysisResult.language_detected,
        translation_used: analysisResult.translation_used,
        problem_type: analysisResult.problem_type,
        problem_confidence: analysisResult.problem_confidence,
        length: analysisResult.length,
        word_count: analysisResult.word_count,
        created_at: analysisResult.created_at
      });
      
      // Callback sécurisé pour ajouter le commentaire
      if (onNewComment && typeof onNewComment === 'function') {
        const newComment = {
          id: analysisResult.id || Date.now(),
          text: analysisResult.text,
          text_french: analysisResult.translated_text || analysisResult.text,
          text_arabic: analysisResult.original_text || '',
          sentiment: analysisResult.sentiment,
          confidence: analysisResult.confidence,
          problem_type: analysisResult.problem_type || 'N/A',
          date: analysisResult.created_at ? analysisResult.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          user: "👤 Vous"
        };
        onNewComment(newComment);
      }
      
      setText('');
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setError(error.message);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
    setError('');
  };

  const getSentimentConfig = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return {
          color: 'text-green-700 bg-green-50 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          gradient: 'from-green-400 to-emerald-500',
          bgGradient: 'from-green-50 to-emerald-50',
          textColor: 'text-green-600',
          borderColor: 'border-green-500'
        };
      case 'negative':
        return {
          color: 'text-red-700 bg-red-50 border-red-200',
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          gradient: 'from-red-400 to-rose-500',
          bgGradient: 'from-red-50 to-rose-50',
          textColor: 'text-red-600',
          borderColor: 'border-red-500'
        };
      case 'neutral':
        return {
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          icon: <Minus className="w-5 h-5 text-amber-600" />,
          gradient: 'from-amber-400 to-yellow-500',
          bgGradient: 'from-amber-50 to-yellow-50',
          textColor: 'text-amber-600',
          borderColor: 'border-amber-500'
        };
      default:
        return {
          color: 'text-gray-700 bg-gray-50 border-gray-200',
          icon: <MessageSquare className="w-5 h-5 text-gray-600" />,
          gradient: 'from-gray-400 to-slate-500',
          bgGradient: 'from-gray-50 to-slate-50',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-500'
        };
    }
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return { label: 'Très élevée', color: 'text-green-600', bgColor: 'bg-green-100', icon: <Award className="w-4 h-4" /> };
    if (confidence >= 0.6) return { label: 'Élevée', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: <Star className="w-4 h-4" /> };
    if (confidence >= 0.4) return { label: 'Modérée', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: <Activity className="w-4 h-4" /> };
    return { label: 'Faible', color: 'text-red-600', bgColor: 'bg-red-100', icon: <Search className="w-4 h-4" /> };
  };

  const getRecommendation = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          title: 'Opportunité d\'amplification',
          text: 'Excellent retour client ! Utilisez ce témoignage pour valoriser votre offre Algérie Télécom et fidéliser votre clientèle.',
          actionColor: 'bg-green-600 hover:bg-green-700',
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100'
        };
      case 'negative':
        return {
          icon: <Target className="w-5 h-5" />,
          title: 'Action corrective prioritaire',
          text: 'Point d\'amélioration identifié. Analysez les causes racines et déployez un plan d\'action pour optimiser l\'expérience client Algérie Télécom.',
          actionColor: 'bg-red-600 hover:bg-red-700',
          bgColor: 'bg-gradient-to-br from-red-50 to-rose-100'
        };
      case 'neutral':
        return {
          icon: <Activity className="w-5 h-5" />,
          title: 'Potentiel d\'engagement',
          text: 'Retour neutre détecté. Sollicitez des précisions pour mieux comprendre les attentes et transformer l\'expérience client.',
          actionColor: 'bg-amber-600 hover:bg-amber-700',
          bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-100'
        };
      default:
        return {
          icon: <MessageSquare className="w-5 h-5" />,
          title: 'Analyse en cours',
          text: 'Évaluation du sentiment en cours de traitement.',
          actionColor: 'bg-gray-600 hover:bg-gray-700',
          bgColor: 'bg-gradient-to-br from-gray-50 to-slate-100'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* En-tête avec gradient Algérie Télécom */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-3xl shadow-2xl">
        {/* Motifs de fond */}
        <div className="absolute inset-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative p-8 lg:p-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Analyse Intelligente de Sentiment
            </h1>
            <p className="text-xl text-blue-100 mb-6 leading-relaxed">
              Technologie d'IA avancée • Support multilingue • Algérie Télécom
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <Languages className="w-4 h-4 text-white" />
                <span className="text-white font-medium">🇩🇿 Darija & 🇫🇷 Français</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-medium">IA SentimentIQ</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Analyse sécurisée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Zone de saisie premium */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 lg:p-12">
          {/* Message d'erreur */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-2xl">
              <div className="flex items-start">
                <XCircle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-semibold mb-1">Erreur d'analyse</h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span>Texte à analyser</span>
                </div>
              </label>
              
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Saisissez votre commentaire en français ou en darija algérienne... Notre IA SentimentIQ analysera automatiquement le sentiment et traduira si nécessaire."
                  className="w-full h-40 p-8 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 resize-none transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg leading-relaxed"
                />
                
                {/* Compteurs flottants */}
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">{text.length} caractères</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {text.split(' ').filter(word => word.length > 0).length} mots
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <button
                onClick={handleReset}
                disabled={!text.length}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-medium">Effacer</span>
              </button>

              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-bold text-lg relative overflow-hidden group"
              >
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {loading ? (
                  <>
                    <div className="relative">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <Brain className="absolute inset-1 w-4 h-4 text-white animate-pulse" />
                    </div>
                    <span>SentimentIQ analyse...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Analyser avec SentimentIQ</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats premium */}
      {result && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {result.error ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">Erreur d'analyse</h3>
              <p className="text-red-500 mb-8 text-lg">{result.error}</p>
              <button
                onClick={handleReset}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Réessayer</span>
              </button>
            </div>
          ) : (
            <div className="p-8 lg:p-12">
              {/* En-tête des résultats */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
                <div className="mb-6 lg:mb-0">
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center mr-4">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    Résultats SentimentIQ
                  </h3>
                  <p className="text-gray-600 text-lg">Analyse complète par intelligence artificielle</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {result.created_at && (
                    <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 font-medium text-sm">
                        {new Date(result.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl">
                    <Cpu className="w-4 h-4" />
                    <span className="font-medium text-sm">IA Active</span>
                  </div>
                </div>
              </div>

              {/* Statut de traduction premium */}
              {result.translation_used && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 rounded-2xl">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Languages className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-blue-800 font-bold text-lg mb-1">Traduction automatique effectuée</h4>
                      <p className="text-blue-700">Darija algérienne → Français • Powered by Algérie Télécom</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600 text-sm font-medium">Technologie multilingue avancée</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Sentiment Principal - 2/3 */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Sentiment Card */}
                  <div className={`p-8 rounded-3xl border-2 ${getSentimentConfig(result.sentiment).bgGradient} ${getSentimentConfig(result.sentiment).borderColor} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-16 -mt-16">
                      {getSentimentConfig(result.sentiment).icon}
                    </div>
                    
                    <div className="relative">
                      <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        {getSentimentConfig(result.sentiment).icon}
                        <span className="ml-3">Sentiment Détecté</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                          <span className={`inline-block px-8 py-4 rounded-2xl font-bold capitalize text-2xl border-2 ${getSentimentConfig(result.sentiment).color} shadow-lg`}>
                            {result.sentiment}
                          </span>
                        </div>
                        <div className="text-center md:text-right">
                          <div className={`text-5xl font-bold ${getSentimentConfig(result.sentiment).textColor} mb-2`}>
                            {Math.round(result.confidence * 100)}%
                          </div>
                          <div className="text-gray-600 font-semibold">Niveau de confiance</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Type de problème premium */}
                  {result.problem_type && result.problem_type !== 'N/A' && (
                    <div className="p-8 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl border-2 border-purple-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-10 rounded-full -mr-12 -mt-12"></div>
                      
                      <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mr-3">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        Type de Problème Identifié
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                          <span className="inline-block px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg">
                            {result.problem_type}
                          </span>
                        </div>
                        <div className="text-center md:text-right">
                          <div className="text-4xl font-bold text-purple-600 mb-2">
                            {Math.round((result.problem_confidence || 0) * 100)}%
                          </div>
                          <div className="text-gray-600 font-semibold">Précision de classification</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Barre de confiance premium */}
                  <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200">
                    <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <Activity className="w-6 h-6 text-gray-600 mr-3" />
                      Analyse de Confiance
                    </h4>
                    
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div 
                            className={`h-4 rounded-full transition-all duration-2000 bg-gradient-to-r ${getSentimentConfig(result.sentiment).gradient} relative overflow-hidden`}
                            style={{ width: `${result.confidence * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl ${getConfidenceLevel(result.confidence).bgColor} ${getConfidenceLevel(result.confidence).color}`}>
                          {getConfidenceLevel(result.confidence).icon}
                          <span className="font-bold text-lg">{getConfidenceLevel(result.confidence).label}</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getConfidenceLevel(result.confidence).color}`}>
                            {(result.confidence * 100).toFixed(1)}%
                          </div>
                          <div className="text-gray-500 text-sm">Score précis</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommandations premium */}
                  <div className={`p-8 rounded-3xl border-2 border-opacity-20 ${getRecommendation(result.sentiment).bgColor}`}>
                    <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <div className={`w-10 h-10 ${getRecommendation(result.sentiment).actionColor} rounded-xl flex items-center justify-center mr-3`}>
                        {getRecommendation(result.sentiment).icon}
                      </div>
                      {getRecommendation(result.sentiment).title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                      {getRecommendation(result.sentiment).text}
                    </p>
                  </div>
                </div>

                {/* Métriques et informations - 1/3 */}
                <div className="space-y-8">
                  {/* Métriques texte */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border border-blue-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">{result.length}</div>
                        <div className="text-blue-700 font-semibold">Caractères</div>
                        <div className="text-blue-600 text-sm mt-1">Analysés par l'IA</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl border border-purple-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                      <div className="relative">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-purple-600 mb-2">{result.word_count}</div>
                        <div className="text-purple-700 font-semibold">Mots</div>
                        <div className="text-purple-600 text-sm mt-1">Traités linguistiquement</div>
                      </div>
                    </div>
                  </div>

                  {/* Métriques du modèle premium */}
                  <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                    
                    <div className="relative">
                      <h5 className="text-lg font-bold mb-6 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center mr-3">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        Métriques IA SentimentIQ
                      </h5>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center space-x-3">
                            <Cpu className="w-5 h-5 text-blue-400" />
                            <span className="text-gray-200">Modèle:</span>
                          </div>
                          <span className="text-white font-bold">SBERT + Groq</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center space-x-3">
                            <Languages className="w-5 h-5 text-green-400" />
                            <span className="text-gray-200">Traduction:</span>
                          </div>
                          <span className="text-white font-bold">{result.translation_used ? '✅ Activée' : '❌ Non requise'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-purple-400" />
                            <span className="text-gray-200">Langue:</span>
                          </div>
                          <span className="text-white font-bold">
                            {result.language_detected === 'arabic' ? '🇩🇿 Darija' : '🇫🇷 Français'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-yellow-400" />
                            <span className="text-gray-200">Précision:</span>
                          </div>
                          <span className="text-white font-bold">{Math.round(result.confidence * 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-white border-opacity-20 text-center">
                        <div className="text-xs text-gray-300">Powered by</div>
                        <div className="text-sm font-bold text-white">Algérie Télécom • SentimentIQ</div>
                      </div>
                    </div>
                  </div>

                  {/* Badge de qualité */}
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl border border-green-200">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h5 className="text-lg font-bold text-green-800 mb-2">Analyse Certifiée</h5>
                    <p className="text-green-700 text-sm">
                      Résultats validés par les standards Algérie Télécom
                    </p>
                  </div>
                </div>
              </div>

              {/* Section textes analysés premium */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h4 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Contenu Analysé
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Texte original (si traduit) */}
                  {result.translation_used && result.original_text && (
                    <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-100 rounded-3xl border-l-4 border-orange-500 relative overflow-hidden">
                      <div className="absolute top-4 right-4 w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">ع</span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-lg font-bold text-orange-800">🇩🇿 Texte Original (Darija)</span>
                        </div>
                        <div className="text-orange-700 text-sm">Langue source détectée automatiquement</div>
                      </div>
                      
                      <blockquote className="text-gray-800 text-lg leading-relaxed italic font-medium p-4 bg-white bg-opacity-50 rounded-xl border border-orange-200" dir="rtl">
                        &quot;{result.original_text}&quot;
                      </blockquote>
                    </div>
                  )}
                  
                  {/* Texte français analysé */}
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl border-l-4 border-blue-500 relative overflow-hidden">
                    <div className="absolute top-4 right-4 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">FR</span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-blue-800">
                          🇫🇷 {result.translation_used ? 'Traduction Française' : 'Texte Analysé'}
                        </span>
                      </div>
                      <div className="text-blue-700 text-sm">
                        {result.translation_used ? 'Traduit automatiquement pour l\'analyse' : 'Analysé directement en français'}
                      </div>
                    </div>
                    
                    <blockquote className="text-gray-800 text-lg leading-relaxed italic font-medium p-4 bg-white bg-opacity-50 rounded-xl border border-blue-200">
                      &quot;{result.text}&quot;
                    </blockquote>
                  </div>
                </div>
              </div>

              {/* Actions finales premium */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-3 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Nouvelle Analyse</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const copyText = result.translation_used 
                        ? `🇩🇿 Original: "${result.original_text}" | 🇫🇷 Traduction: "${result.text}" | 📊 Sentiment: ${result.sentiment} (${Math.round(result.confidence * 100)}%) | 🤖 SentimentIQ • Algérie Télécom`
                        : `📊 Sentiment: ${result.sentiment} (${Math.round(result.confidence * 100)}%) - "${result.text}" | 🤖 SentimentIQ • Algérie Télécom`;
                      navigator.clipboard.writeText(copyText);
                    }}
                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Copier le Résultat</span>
                  </button>

                </div>
                
                <div className="text-center mt-6">
                  <p className="text-gray-500 text-sm">
                    Analyse réalisée par <span className="font-semibold text-gray-700">SentimentIQ</span> • 
                    Technologie <span className="font-semibold text-blue-600">Algérie Télécom</span> • 
                    Résultats sécurisés et confidentiels
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyzeComponent;