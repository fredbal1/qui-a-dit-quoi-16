
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Play, 
  Code, 
  Database,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { MockDataItem } from '@/types/devTools';

const MockAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [mockData, setMockData] = useState<MockDataItem[]>([]);

  // Données mises à jour - la plupart des mocks ont été migrés vers Supabase
  const simulatedMockData: MockDataItem[] = [
    {
      id: '1',
      dataName: 'questions.hardcoded',
      components: ['KiKaDiGame', 'KiDiVraiGame', 'KiDejaGame', 'KiDeNousGame'],
      dataType: 'Question[]',
      currentOrigin: 'hardcoded',
      associatedLogic: 'getRandomQuestion, filterByAmbiance',
      priority: 'medium',
      connectionStatus: 'to-connect',
      description: 'Questions hardcodées dans les composants de jeu'
    },
    {
      id: '2',
      dataName: 'shopItems.static',
      components: ['Shop'],
      dataType: 'ShopItem[]',
      currentOrigin: 'hardcoded',
      associatedLogic: 'purchaseItem, checkOwnership',
      priority: 'low',
      connectionStatus: 'to-connect',
      description: 'Articles de boutique en données statiques'
    },
    {
      id: '3',
      dataName: 'gameSettings.defaults',
      components: ['CreateGame'],
      dataType: 'GameSettings',
      currentOrigin: 'hardcoded',
      associatedLogic: 'validateSettings, saveGameConfig',
      priority: 'low',
      connectionStatus: 'to-connect',
      description: 'Paramètres par défaut des parties'
    }
  ];

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulation de l'analyse avec un délai progressif
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setMockData(simulatedMockData);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.dataName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.components.some(comp => comp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-300/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-300/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-300/30';
    }
  };

  const getOriginIcon = (origin: string) => {
    switch (origin) {
      case 'mock': return <Database className="w-4 h-4" />;
      case 'hardcoded': return <Code className="w-4 h-4" />;
      case 'placeholder': return <AlertCircle className="w-4 h-4" />;
      case 'empty-state': return <Clock className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dev-tools" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux outils
          </Link>
          
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                  Analyseur de Données Mockées 🔍
                </h1>
                <p className="text-white/80 font-inter">
                  Scanner KIADISA - État post-migration Supabase
                </p>
                <div className="mt-2 inline-flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-sm">Migration Supabase terminée</span>
                </div>
              </div>
              <Search className="w-12 h-12 text-blue-300" />
            </div>
          </GlassCard>
        </div>

        {/* Analysis Control */}
        <GlassCard className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-poppins font-semibold text-white mb-2">
                Contrôle d'Analyse
              </h2>
              <p className="text-white/70 text-sm">
                Scanner les dernières données mockées restantes après migration Supabase
              </p>
            </div>
            
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="glass-button text-white border-blue-300/30 hover:bg-blue-500/20"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Analyser les Données Restantes
                </>
              )}
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="mt-4 space-y-2">
              <div className="text-white/80 text-sm">Progression de l'analyse :</div>
              <div className="space-y-1 text-xs text-white/60">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>✅ Profils utilisateur migrés vers Supabase</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>✅ Parties et joueurs connectés à la BDD</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-yellow-400" />
                  <span>Recherche des dernières données hardcodées...</span>
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Results */}
        {analysisComplete && (
          <>
            {/* Filters and Search */}
            <GlassCard className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Rechercher par nom de donnée ou composant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-card border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-white/80" />
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="glass-card border-white/30 text-white bg-transparent text-sm rounded px-2 py-1"
                    >
                      <option value="all" className="bg-slate-800">Toutes priorités</option>
                      <option value="high" className="bg-slate-800">Haute</option>
                      <option value="medium" className="bg-slate-800">Moyenne</option>
                      <option value="low" className="bg-slate-800">Basse</option>
                    </select>
                  </div>
                  
                  <Button size="sm" className="glass-button text-white border-white/30">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter JSON
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-white">{mockData.length}</div>
                <div className="text-white/70 text-sm">Données Restantes</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-green-300">
                  {mockData.filter(d => d.priority === 'low').length}
                </div>
                <div className="text-white/70 text-sm">Faible Priorité</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-yellow-300">
                  {mockData.filter(d => d.currentOrigin === 'hardcoded').length}
                </div>
                <div className="text-white/70 text-sm">Données Hardcodées</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-blue-300">
                  {new Set(mockData.flatMap(d => d.components)).size}
                </div>
                <div className="text-white/70 text-sm">Composants Affectés</div>
              </GlassCard>
            </div>

            {/* Data Table */}
            <GlassCard>
              <h3 className="text-xl font-poppins font-semibold text-white mb-4">
                Données Restantes à Migrer ({filteredData.length})
              </h3>
              
              {filteredData.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h4 className="text-xl text-white mb-2">Migration Terminée ! 🎉</h4>
                  <p className="text-white/70">
                    Toutes les données importantes ont été migrées vers Supabase.
                    Seules quelques données statiques restent en dur dans le code.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-white/80 font-medium p-3">Élément de Donnée</th>
                        <th className="text-left text-white/80 font-medium p-3">Composants</th>
                        <th className="text-left text-white/80 font-medium p-3">Type</th>
                        <th className="text-left text-white/80 font-medium p-3">Origine</th>
                        <th className="text-left text-white/80 font-medium p-3">Logique Associée</th>
                        <th className="text-left text-white/80 font-medium p-3">Priorité</th>
                        <th className="text-left text-white/80 font-medium p-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={item.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-white">{item.dataName}</div>
                              {item.description && (
                                <div className="text-white/60 text-xs mt-1">{item.description}</div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {item.components.map(comp => (
                                <Badge key={comp} variant="outline" className="text-xs border-blue-300/30 text-blue-200">
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <code className="text-green-300 text-sm bg-green-500/10 px-2 py-1 rounded">
                              {item.dataType}
                            </code>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              {getOriginIcon(item.currentOrigin)}
                              <span className="text-white/80 text-sm capitalize">
                                {item.currentOrigin.replace('-', ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-white/70 text-sm font-mono">
                              {item.associatedLogic}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                              {item.priority}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                              <span className="text-yellow-300 text-xs">Optionnel</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
};

export default MockAnalyzer;
