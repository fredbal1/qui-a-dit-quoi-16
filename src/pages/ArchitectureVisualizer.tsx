
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Network, 
  Filter,
  Eye,
  EyeOff,
  Layers,
  Code,
  Database,
  GitBranch
} from 'lucide-react';
import { ArchitectureNode, ArchitectureLink } from '@/types/devTools';

const ArchitectureVisualizer: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [showConnections, setShowConnections] = useState(true);

  // Données d'architecture simulées pour KIADISA
  const nodes: ArchitectureNode[] = [
    // Frontend Components
    {
      id: 'auth-component',
      type: 'component',
      name: 'Auth',
      status: 'not-connected',
      description: 'Composant d\'authentification',
      details: { file: 'src/pages/Auth.tsx', props: ['onLogin', 'onSignup'] }
    },
    {
      id: 'dashboard-component',
      type: 'component',
      name: 'Dashboard',
      status: 'not-connected',
      description: 'Tableau de bord utilisateur',
      details: { file: 'src/pages/Dashboard.tsx', props: ['userProfile', 'stats'] }
    },
    {
      id: 'lobby-component',
      type: 'component',
      name: 'Lobby',
      status: 'not-connected',
      description: 'Salle d\'attente de partie',
      details: { file: 'src/pages/Lobby.tsx', props: ['gameState', 'players'] }
    },
    {
      id: 'kikadi-game',
      type: 'component',
      name: 'KiKaDiGame',
      status: 'not-connected',
      description: 'Mini-jeu KiKaDi',
      details: { file: 'src/components/games/KiKaDiGame.tsx', props: ['question', 'answers'] }
    },
    {
      id: 'shop-component',
      type: 'component',
      name: 'Shop',
      status: 'not-connected',
      description: 'Boutique d\'objets',
      details: { file: 'src/pages/Shop.tsx', props: ['items', 'userCoins'] }
    },

    // Logic Functions
    {
      id: 'auth-logic',
      type: 'logic',
      name: 'Authentication Logic',
      status: 'planned',
      description: 'Logique d\'authentification',
      details: { functions: ['login', 'signup', 'logout', 'updateProfile'] }
    },
    {
      id: 'game-logic',
      type: 'logic',
      name: 'Game Management',
      status: 'planned',
      description: 'Gestion des parties',
      details: { functions: ['createGame', 'joinGame', 'updateGameState'] }
    },
    {
      id: 'player-logic',
      type: 'logic',
      name: 'Player Management',
      status: 'planned',
      description: 'Gestion des joueurs',
      details: { functions: ['addPlayer', 'removePlayer', 'updateScore'] }
    },
    {
      id: 'answer-logic',
      type: 'logic',
      name: 'Answer Processing',
      status: 'planned',
      description: 'Traitement des réponses',
      details: { functions: ['submitAnswer', 'validateAnswer', 'getAnswers'] }
    },
    {
      id: 'shop-logic',
      type: 'logic',
      name: 'Shop Logic',
      status: 'planned',
      description: 'Logique de boutique',
      details: { functions: ['purchaseItem', 'checkOwnership', 'updateCoins'] }
    },

    // Supabase Tables
    {
      id: 'profiles-table',
      type: 'table',
      name: 'profiles',
      status: 'planned',
      description: 'Table des profils utilisateurs',
      details: { columns: ['id', 'user_id', 'pseudo', 'avatar', 'level', 'xp', 'coins'] }
    },
    {
      id: 'games-table',
      type: 'table',
      name: 'games',
      status: 'planned',
      description: 'Table des parties',
      details: { columns: ['id', 'code', 'host_id', 'status', 'mode', 'settings'] }
    },
    {
      id: 'players-table',
      type: 'table',
      name: 'players',
      status: 'planned',
      description: 'Table des joueurs en partie',
      details: { columns: ['id', 'game_id', 'profile_id', 'score', 'is_host'] }
    },
    {
      id: 'answers-table',
      type: 'table',
      name: 'answers',
      status: 'planned',
      description: 'Table des réponses',
      details: { columns: ['id', 'round_id', 'player_id', 'content', 'is_bluff'] }
    },
    {
      id: 'questions-table',
      type: 'table',
      name: 'questions',
      status: 'planned',
      description: 'Table des questions',
      details: { columns: ['id', 'text', 'game_type', 'ambiance', 'category'] }
    }
  ];

  const links: ArchitectureLink[] = [
    // Component -> Logic connections
    {
      source: 'auth-component',
      target: 'auth-logic',
      type: 'calls',
      description: 'Auth component calls authentication functions'
    },
    {
      source: 'dashboard-component',
      target: 'auth-logic',
      type: 'calls',
      description: 'Dashboard reads user profile'
    },
    {
      source: 'lobby-component',
      target: 'game-logic',
      type: 'calls',
      description: 'Lobby manages game state'
    },
    {
      source: 'lobby-component',
      target: 'player-logic',
      type: 'calls',
      description: 'Lobby manages players'
    },
    {
      source: 'kikadi-game',
      target: 'answer-logic',
      type: 'calls',
      description: 'Game components handle answers'
    },
    {
      source: 'shop-component',
      target: 'shop-logic',
      type: 'calls',
      description: 'Shop component handles purchases'
    },

    // Logic -> Table connections
    {
      source: 'auth-logic',
      target: 'profiles-table',
      type: 'reads',
      description: 'Authentication reads/writes profiles'
    },
    {
      source: 'auth-logic',
      target: 'profiles-table',
      type: 'writes',
      description: 'Authentication updates profiles'
    },
    {
      source: 'game-logic',
      target: 'games-table',
      type: 'writes',
      description: 'Game logic creates/updates games'
    },
    {
      source: 'player-logic',
      target: 'players-table',
      type: 'writes',
      description: 'Player logic manages players table'
    },
    {
      source: 'answer-logic',
      target: 'answers-table',
      type: 'writes',
      description: 'Answer logic stores answers'
    },
    {
      source: 'answer-logic',
      target: 'questions-table',
      type: 'reads',
      description: 'Answer logic reads questions'
    },
    {
      source: 'shop-logic',
      target: 'profiles-table',
      type: 'updates',
      description: 'Shop logic updates user coins'
    }
  ];

  const filteredNodes = nodes.filter(node => {
    if (selectedFilter === 'all') return true;
    return node.type === selectedFilter;
  });

  const getNodeColor = (node: ArchitectureNode) => {
    const typeColors = {
      component: 'from-blue-500 to-purple-600',
      logic: 'from-green-500 to-teal-600',
      table: 'from-orange-500 to-red-600'
    };
    return typeColors[node.type];
  };

  const getNodeIcon = (node: ArchitectureNode) => {
    switch (node.type) {
      case 'component': return Code;
      case 'logic': return GitBranch;
      case 'table': return Database;
      default: return Code;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-300 border-green-300/30';
      case 'not-connected': return 'bg-red-500/20 text-red-300 border-red-300/30';
      case 'planned': return 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-300/30';
    }
  };

  const getConnectedNodes = (nodeId: string) => {
    const connected = new Set<string>();
    links.forEach(link => {
      if (link.source === nodeId) connected.add(link.target);
      if (link.target === nodeId) connected.add(link.source);
    });
    return Array.from(connected);
  };

  const getNodeConnections = (nodeId: string) => {
    return links.filter(link => link.source === nodeId || link.target === nodeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
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
                  Visualiseur d'Architecture 🗺️
                </h1>
                <p className="text-white/80 font-inter">
                  Cartographie visuelle de l'architecture frontend-backend prévue
                </p>
              </div>
              <Network className="w-12 h-12 text-purple-300" />
            </div>
          </GlassCard>
        </div>

        {/* Controls */}
        <GlassCard className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-white/80" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="glass-card border-white/30 text-white bg-transparent text-sm rounded px-3 py-1"
                >
                  <option value="all" className="bg-slate-800">Tous les éléments</option>
                  <option value="component" className="bg-slate-800">Composants Frontend</option>
                  <option value="logic" className="bg-slate-800">Logique Métier</option>
                  <option value="table" className="bg-slate-800">Tables Supabase</option>
                </select>
              </div>
              
              <Button
                size="sm"
                onClick={() => setShowConnections(!showConnections)}
                className="glass-button text-white border-white/30"
              >
                {showConnections ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                {showConnections ? 'Masquer' : 'Afficher'} Connexions
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-red-300">Non Connecté</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-yellow-300">Planifié</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-green-300">Connecté</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Nodes Grid */}
          <div className="lg:col-span-3">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-poppins font-semibold text-white">
                  Architecture Map ({filteredNodes.length} éléments)
                </h2>
                <Layers className="w-6 h-6 text-purple-300" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredNodes.map(node => {
                  const IconComponent = getNodeIcon(node);
                  const isSelected = selectedNode === node.id;
                  const connectedNodes = selectedNode ? getConnectedNodes(selectedNode) : [];
                  const isConnected = connectedNodes.includes(node.id);
                  
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(selectedNode === node.id ? '' : node.id)}
                      className={`relative cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'scale-105 z-10' 
                          : selectedNode && !isConnected 
                            ? 'opacity-50' 
                            : ''
                      }`}
                    >
                      <GlassCard
                        className={`${
                          isSelected 
                            ? 'ring-2 ring-purple-300 bg-purple-500/20' 
                            : isConnected 
                              ? 'ring-1 ring-yellow-300/50 bg-yellow-500/10'
                              : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="relative overflow-hidden">
                          {/* Gradient Background */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${getNodeColor(node)} opacity-20 rounded-lg`} />
                          
                          <div className="relative p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${getNodeColor(node)} shadow-lg`}>
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <Badge className={`${getStatusColor(node.status)} text-xs`}>
                                {node.status}
                              </Badge>
                            </div>
                            
                            <h3 className="font-poppins font-semibold text-white text-sm mb-1">
                              {node.name}
                            </h3>
                            <p className="text-white/60 text-xs mb-3">
                              {node.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs border-white/30 text-white/80">
                                {node.type}
                              </Badge>
                              {showConnections && (
                                <div className="text-xs text-white/60">
                                  {getConnectedNodes(node.id).length} connexions
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Node Details */}
          <div className="lg:col-span-1">
            {selectedNode ? (
              <GlassCard>
                {(() => {
                  const node = nodes.find(n => n.id === selectedNode);
                  if (!node) return null;
                  
                  const IconComponent = getNodeIcon(node);
                  const connections = getNodeConnections(selectedNode);
                  
                  return (
                    <>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${getNodeColor(node)} shadow-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-poppins font-semibold text-white">{node.name}</h3>
                          <Badge className={`${getStatusColor(node.status)} text-xs`}>
                            {node.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-4">{node.description}</p>
                      
                      {/* Node Details */}
                      <div className="mb-4">
                        <h4 className="text-white font-medium text-sm mb-2">Détails :</h4>
                        <div className="glass-card bg-white/5 p-3 rounded">
                          {node.details && (
                            <div className="space-y-1 text-xs">
                              {Object.entries(node.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-white/60 capitalize">{key}: </span>
                                  <span className="text-white/80">
                                    {Array.isArray(value) ? value.join(', ') : value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Connections */}
                      <div>
                        <h4 className="text-white font-medium text-sm mb-2">
                          Connexions ({connections.length}) :
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {connections.map((conn, idx) => {
                            const targetNode = nodes.find(n => 
                              n.id === (conn.source === selectedNode ? conn.target : conn.source)
                            );
                            if (!targetNode) return null;
                            
                            return (
                              <div key={idx} className="glass-card bg-white/5 p-2 rounded text-xs">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    conn.type === 'calls' ? 'bg-blue-500/20 text-blue-300' :
                                    conn.type === 'reads' ? 'bg-green-500/20 text-green-300' :
                                    conn.type === 'writes' ? 'bg-orange-500/20 text-orange-300' :
                                    'bg-purple-500/20 text-purple-300'
                                  }`}>
                                    {conn.type}
                                  </span>
                                  <span className="text-white/80">{targetNode.name}</span>
                                </div>
                                <p className="text-white/60 text-xs">{conn.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </GlassCard>
            ) : (
              <GlassCard className="text-center py-12">
                <Network className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-poppins font-semibold text-white mb-2">
                  Sélectionnez un élément
                </h3>
                <p className="text-white/60">
                  Cliquez sur un nœud pour voir ses détails et connexions
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureVisualizer;
