
import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Database, 
  Shield, 
  Network,
  ArrowLeft,
  Code,
  Settings,
  Eye
} from 'lucide-react';

const DevTools: React.FC = () => {
  const tools = [
    {
      id: 'mock-analyzer',
      title: 'Analyseur de Données Mockées',
      description: 'Scanner le code KIADISA pour identifier toutes les données mockées et placeholders',
      icon: Search,
      path: '/dev-tools/mock-analyzer',
      status: 'ready',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'schema-suggester',
      title: 'Planificateur de Schéma Supabase',
      description: 'Générer une structure de base de données optimisée pour KIADISA',
      icon: Database,
      path: '/dev-tools/supabase-schema-suggester',
      status: 'ready',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'best-practices',
      title: 'Conseiller Bonnes Pratiques',
      description: 'Recommandations RLS, indexation et sécurité pour Supabase',
      icon: Shield,
      path: '/dev-tools/best-practices-advisor',
      status: 'ready',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'architecture-viz',
      title: 'Visualiseur d\'Architecture',
      description: 'Cartographie visuelle de l\'architecture frontend-backend prévue',
      icon: Network,
      path: '/dev-tools/architecture-visualizer',
      status: 'ready',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à KIADISA
          </Link>
          
          <GlassCard className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Code className="w-8 h-8 text-purple-300" />
              <h1 className="text-4xl font-poppins font-bold text-white">
                Outils de Développement
              </h1>
              <Settings className="w-8 h-8 text-purple-300 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <p className="text-white/80 font-inter text-lg">
              Analyse et planification pour l'intégration Supabase de KIADISA
            </p>
            <div className="mt-4 inline-flex items-center space-x-2 glass-card bg-yellow-500/20 px-4 py-2 rounded-lg">
              <Eye className="w-4 h-4 text-yellow-300" />
              <span className="text-yellow-100 text-sm">
                Outils pré-connexion Supabase
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <GlassCard 
                key={tool.id}
                hover
                className="cursor-pointer transition-all duration-300 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={tool.path} className="block">
                  <div className="relative overflow-hidden">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-20 rounded-lg`} />
                    
                    <div className="relative p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-poppins font-bold text-white mb-2">
                            {tool.title}
                          </h3>
                          <p className="text-white/80 font-inter text-sm mb-4">
                            {tool.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="inline-flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-green-300 text-xs font-medium">
                                {tool.status === 'ready' ? 'Prêt' : 'En développement'}
                              </span>
                            </div>
                            
                            <Button
                              size="sm"
                              className="glass-button text-white border-white/30 hover:bg-white/20"
                            >
                              Ouvrir →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </GlassCard>
            );
          })}
        </div>

        {/* Footer Info */}
        <GlassCard className="mt-8">
          <div className="text-center">
            <h3 className="text-lg font-poppins font-semibold text-white mb-3">
              Workflow de Transition
            </h3>
            <div className="flex flex-wrap justify-center items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-blue-300">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span>1. Analyser les mocks</span>
              </div>
              <span className="text-white/60">→</span>
              <div className="flex items-center space-x-2 text-green-300">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>2. Planifier le schéma</span>
              </div>
              <span className="text-white/60">→</span>
              <div className="flex items-center space-x-2 text-orange-300">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                <span>3. Appliquer les bonnes pratiques</span>
              </div>
              <span className="text-white/60">→</span>
              <div className="flex items-center space-x-2 text-purple-300">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <span>4. Visualiser l'architecture</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DevTools;
