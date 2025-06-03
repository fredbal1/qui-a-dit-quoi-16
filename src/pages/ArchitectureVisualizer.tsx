
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Network, 
  Database, 
  Code,
  Users,
  Play,
  Eye,
  Layers,
  Zap
} from 'lucide-react';

const ArchitectureVisualizer: React.FC = () => {
  const [selectedView, setSelectedView] = useState('overview');

  const architectureData = {
    frontend: [
      { id: 'pages', name: 'Pages', components: ['Index', 'Auth', 'Dashboard', 'Game', 'Lobby'], status: 'connected' },
      { id: 'components', name: 'Composants', components: ['KiKaDiGame', 'KiDiVraiGame', 'GameResults'], status: 'connected' },
      { id: 'hooks', name: 'Hooks', components: ['useAuth', 'useGameData', 'useGameManagement'], status: 'connected' }
    ],
    backend: [
      { id: 'auth', name: 'Authentification', tables: ['auth.users'], status: 'connected' },
      { id: 'profiles', name: 'Profils', tables: ['profiles'], status: 'connected' },
      { id: 'games', name: 'Parties', tables: ['games', 'players'], status: 'connected' },
      { id: 'questions', name: 'Questions', tables: ['questions'], status: 'planned' }
    ],
    connections: [
      { from: 'useAuth', to: 'profiles', type: 'reads', description: 'Chargement profil utilisateur' },
      { from: 'useGameManagement', to: 'games', type: 'writes', description: 'Création/mise à jour parties' },
      { from: 'Game', to: 'players', type: 'reads', description: 'Liste des joueurs en partie' },
      { from: 'Dashboard', to: 'profiles', type: 'reads', description: 'Affichage stats utilisateur' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-300 border-green-300/30';
      case 'planned': return 'bg-blue-500/20 text-blue-300 border-blue-300/30';
      case 'not-connected': return 'bg-red-500/20 text-red-300 border-red-300/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-300/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Zap className="w-4 h-4 text-green-400" />;
      case 'planned': return <Eye className="w-4 h-4 text-blue-400" />;
      case 'not-connected': return <Database className="w-4 h-4 text-red-400" />;
      default: return <Code className="w-4 h-4 text-gray-400" />;
    }
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
                  Visualiseur d'Architecture 🏗️
                </h1>
                <p className="text-white/80 font-inter">
                  Cartographie visuelle de l'architecture frontend-backend KIADISA
                </p>
              </div>
              <Network className="w-12 h-12 text-purple-300" />
            </div>
          </GlassCard>
        </div>

        <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
          <TabsList className="bg-white/10">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="flow">Flux de données</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Frontend Overview */}
              <GlassCard>
                <div className="flex items-center space-x-3 mb-4">
                  <Code className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Frontend React</h2>
                </div>
                
                <div className="space-y-3">
                  {architectureData.frontend.map(layer => (
                    <div key={layer.id} className="glass-card bg-white/5 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{layer.name}</span>
                        <Badge className={`${getStatusColor(layer.status)} text-xs`}>
                          {layer.status === 'connected' ? 'Connecté' : 'Planifié'}
                        </Badge>
                      </div>
                      <div className="text-white/60 text-sm">
                        {layer.components.length} composants/hooks
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Backend Overview */}
              <GlassCard>
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">Backend Supabase</h2>
                </div>
                
                <div className="space-y-3">
                  {architectureData.backend.map(service => (
                    <div key={service.id} className="glass-card bg-white/5 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{service.name}</span>
                        <Badge className={`${getStatusColor(service.status)} text-xs`}>
                          {service.status === 'connected' ? 'Connecté' : 'Planifié'}
                        </Badge>
                      </div>
                      <div className="text-white/60 text-sm">
                        {service.tables.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Stats */}
            <GlassCard className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statistiques d'Architecture</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center glass-card bg-white/5 p-4">
                  <div className="text-2xl font-bold text-blue-400">7</div>
                  <div className="text-white/70 text-sm">Composants Connectés</div>
                </div>
                <div className="text-center glass-card bg-white/5 p-4">
                  <div className="text-2xl font-bold text-green-400">3</div>
                  <div className="text-white/70 text-sm">Tables Actives</div>
                </div>
                <div className="text-center glass-card bg-white/5 p-4">
                  <div className="text-2xl font-bold text-purple-400">4</div>
                  <div className="text-white/70 text-sm">Flux de Données</div>
                </div>
                <div className="text-center glass-card bg-white/5 p-4">
                  <div className="text-2xl font-bold text-yellow-400">85%</div>
                  <div className="text-white/70 text-sm">Couverture</div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="frontend">
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6">Architecture Frontend</h2>
              
              <div className="space-y-6">
                {architectureData.frontend.map(layer => (
                  <div key={layer.id} className="glass-card bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(layer.status)}
                        <h3 className="text-lg font-medium text-white">{layer.name}</h3>
                      </div>
                      <Badge className={`${getStatusColor(layer.status)} text-xs`}>
                        {layer.status === 'connected' ? 'Connecté' : 'Planifié'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {layer.components.map(component => (
                        <div key={component} className="bg-slate-800/50 rounded-md p-2 text-center">
                          <span className="text-white text-sm">{component}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="backend">
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6">Architecture Backend</h2>
              
              <div className="space-y-6">
                {architectureData.backend.map(service => (
                  <div key={service.id} className="glass-card bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(service.status)}
                        <h3 className="text-lg font-medium text-white">{service.name}</h3>
                      </div>
                      <Badge className={`${getStatusColor(service.status)} text-xs`}>
                        {service.status === 'connected' ? 'Connecté' : 'Planifié'}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {service.tables.map(table => (
                        <div key={table} className="bg-green-500/10 border border-green-300/30 rounded-md px-3 py-1">
                          <span className="text-green-300 text-sm">{table}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="flow">
            <GlassCard>
              <h2 className="text-xl font-semibold text-white mb-6">Flux de Données</h2>
              
              <div className="space-y-4">
                {architectureData.connections.map((connection, index) => (
                  <div key={index} className="glass-card bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-500/20 border border-blue-300/30 rounded-md px-3 py-1">
                          <span className="text-blue-300 text-sm">{connection.from}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-0.5 bg-white/30"></div>
                          <span className="text-white/60 text-xs">{connection.type}</span>
                          <div className="w-8 h-0.5 bg-white/30"></div>
                        </div>
                        <div className="bg-green-500/20 border border-green-300/30 rounded-md px-3 py-1">
                          <span className="text-green-300 text-sm">{connection.to}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mt-2">{connection.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArchitectureVisualizer;
