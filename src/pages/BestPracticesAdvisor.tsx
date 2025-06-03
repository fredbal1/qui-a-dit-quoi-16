
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Shield, 
  Database, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Users,
  Lock,
  Eye
} from 'lucide-react';

const BestPracticesAdvisor: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('rls');

  const practices = {
    rls: [
      {
        id: 'rls-1',
        title: 'Politiques RLS par Utilisateur',
        description: 'Chaque table contenant des données utilisateur doit avoir des politiques RLS',
        priority: 'high',
        status: 'implemented',
        example: `-- Exemple pour la table profiles
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);`
      },
      {
        id: 'rls-2',
        title: 'Sécurité des Parties',
        description: 'Les joueurs ne peuvent voir que leurs propres parties',
        priority: 'high',
        status: 'todo',
        example: `-- Politique pour les parties
CREATE POLICY "Players can view their games" 
ON games FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM players 
    WHERE players.game_id = games.id 
    AND players.user_id = auth.uid()
  )
);`
      }
    ],
    indexing: [
      {
        id: 'idx-1',
        title: 'Index sur les Clés Étrangères',
        description: 'Optimiser les jointures avec des index',
        priority: 'medium',
        status: 'implemented',
        example: `CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_players_user_id ON players(user_id);`
      },
      {
        id: 'idx-2',
        title: 'Index Composites',
        description: 'Index multi-colonnes pour les requêtes fréquentes',
        priority: 'medium',
        status: 'todo',
        example: `CREATE INDEX idx_games_status_created ON games(status, created_at);`
      }
    ],
    security: [
      {
        id: 'sec-1',
        title: 'Validation des Données',
        description: 'Utiliser des contraintes et triggers pour valider',
        priority: 'high',
        status: 'partial',
        example: `-- Contrainte sur le pseudo
ALTER TABLE profiles 
ADD CONSTRAINT pseudo_length 
CHECK (length(pseudo) >= 3 AND length(pseudo) <= 20);`
      },
      {
        id: 'sec-2',
        title: 'Limitation du Taux',
        description: 'Protéger contre les abus avec rate limiting',
        priority: 'medium',
        status: 'todo',
        example: `-- Edge function avec rate limiting
const rateLimiter = new Map();
const RATE_LIMIT = 10; // 10 requêtes par minute`
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-300/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-300/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-300/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'todo': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-4">
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
                  Conseiller Bonnes Pratiques 🛡️
                </h1>
                <p className="text-white/80 font-inter">
                  Recommandations RLS, indexation et sécurité pour Supabase
                </p>
              </div>
              <Shield className="w-12 h-12 text-orange-300" />
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories */}
          <div className="lg:col-span-1">
            <GlassCard>
              <h2 className="text-xl font-poppins font-semibold text-white mb-4">
                Catégories
              </h2>
              
              <div className="space-y-2">
                {[
                  { id: 'rls', name: 'Sécurité RLS', icon: Lock, count: practices.rls.length },
                  { id: 'indexing', name: 'Indexation', icon: Zap, count: practices.indexing.length },
                  { id: 'security', name: 'Sécurité Générale', icon: Shield, count: practices.security.length }
                ].map(category => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`glass-card cursor-pointer transition-all duration-200 p-3 ${
                        selectedCategory === category.id ? 'bg-orange-500/20 border-orange-300/30' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4 text-orange-300" />
                          <span className="font-medium text-white">{category.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs border-orange-300/30 text-orange-200">
                          {category.count}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Stats */}
            <GlassCard className="mt-6">
              <h3 className="text-lg font-poppins font-semibold text-white mb-4">
                Statistiques
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Implémenté</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Partiel</span>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">1</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">À faire</span>
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">2</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Practices List */}
          <div className="lg:col-span-3">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-poppins font-semibold text-white">
                  Recommandations
                </h2>
                <Button
                  size="sm"
                  className="glass-button text-white border-orange-300/30 hover:bg-orange-500/20"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Analyser le Projet
                </Button>
              </div>

              <div className="space-y-4">
                {practices[selectedCategory as keyof typeof practices].map(practice => (
                  <div key={practice.id} className="glass-card bg-white/5 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(practice.status)}
                        <div>
                          <h3 className="text-lg font-medium text-white">{practice.title}</h3>
                          <p className="text-white/70 text-sm">{practice.description}</p>
                        </div>
                      </div>
                      <Badge className={`${getPriorityColor(practice.priority)} text-xs`}>
                        {practice.priority}
                      </Badge>
                    </div>

                    <div className="bg-slate-800/70 rounded-md p-3 mt-3">
                      <pre className="text-green-300 text-sm whitespace-pre-wrap overflow-x-auto">
                        {practice.example}
                      </pre>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="outline" className="border-white/20 text-white">
                        Appliquer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestPracticesAdvisor;
