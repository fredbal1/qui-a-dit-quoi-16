
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDevTools } from '@/hooks/useDevTools';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, UserPlus, Wand, Zap } from 'lucide-react';

const DevSandbox: React.FC = () => {
  const { user } = useAuth();
  const { devActions, isLoading, joinGameForced, addFakePlayer, forceGamePhase } = useDevTools();
  
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  
  // Access limité à un email spécifique
  const ALLOWED_EMAIL = 'dev@kiadisa.fr'; // Remplacer par votre email de développement
  
  // Rediriger si pas le bon email
  if (!user || user.email !== ALLOWED_EMAIL) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/dev-tools" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux outils dev
          </Link>
          
          <GlassCard>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                  Sandbox Développeur
                </h1>
                <p className="text-white/80 font-inter">
                  Environnement de test pour le développement de KIADISA
                </p>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm">
                  Mode développeur activé
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
        
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Actions rapides */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Actions rapides
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {devActions.map(action => (
                <Button
                  key={action.id}
                  onClick={() => action.action()}
                  disabled={isLoading}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {action.name}
                </Button>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg text-white font-medium mb-3">
                Rejoindre une partie spécifique
              </h3>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="CODE123"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
                
                <Button
                  onClick={() => joinGameForced(gameCode)}
                  disabled={!gameCode || isLoading}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Rejoindre
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg text-white font-medium mb-3">
                Ajouter un joueur test
              </h3>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Pseudo du joueur"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
                
                <Button
                  onClick={() => addFakePlayer('current', playerName)}
                  disabled={!playerName || isLoading}
                  variant="outline"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </GlassCard>
          
          {/* Contrôles de partie */}
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Wand className="w-5 h-5 mr-2 text-purple-400" />
              Contrôles de partie
            </h2>
            
            <Tabs defaultValue="phases">
              <TabsList className="bg-white/10 mb-4">
                <TabsTrigger value="phases">Phases</TabsTrigger>
                <TabsTrigger value="games">Mini-jeux</TabsTrigger>
                <TabsTrigger value="scores">Scores</TabsTrigger>
              </TabsList>
              
              <TabsContent value="phases">
                <div className="grid grid-cols-2 gap-4">
                  {['intro', 'answer', 'vote', 'reveal', 'results'].map(phase => (
                    <Button
                      key={phase}
                      onClick={() => forceGamePhase('current', phase)}
                      disabled={isLoading}
                      className={`border ${getPhaseColor(phase)}`}
                      variant="outline"
                    >
                      {getPhaseLabel(phase)}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="games">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'kikadi', name: 'KiKaDi 🧠' },
                    { id: 'kidivrai', name: 'KiDiVrai 😏' },
                    { id: 'kideja', name: 'KiDéjà 🤭' },
                    { id: 'kidenous', name: 'KiDeNous 😱' }
                  ].map(game => (
                    <Button
                      key={game.id}
                      onClick={() => console.log(`Lancer ${game.id}`)}
                      variant="outline"
                      className="border-white/20"
                    >
                      {game.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="scores">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white mb-2">Incrémenter des points</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 3, 5].map(points => (
                        <Button
                          key={`add-${points}`}
                          onClick={() => console.log(`Ajouter ${points} points`)}
                          variant="outline"
                          className="border-green-500/30 text-green-400"
                        >
                          +{points} pts
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white mb-2">Décrémenter des points</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 3, 5].map(points => (
                        <Button
                          key={`remove-${points}`}
                          onClick={() => console.log(`Retirer ${points} points`)}
                          variant="outline"
                          className="border-red-500/30 text-red-400"
                        >
                          -{points} pts
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </div>
        
        {/* Visualisation */}
        <GlassCard className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Visualisation
          </h2>
          
          <div className="bg-slate-900/50 border border-white/10 p-4 rounded-md">
            <div className="text-center text-white/60">
              Prévisualisation en cours de développement
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// Fonctions utilitaires pour formater les phases
function getPhaseColor(phase: string): string {
  switch (phase) {
    case 'intro': return 'border-blue-500/30 text-blue-300';
    case 'answer': return 'border-green-500/30 text-green-300';
    case 'vote': return 'border-yellow-500/30 text-yellow-300';
    case 'reveal': return 'border-purple-500/30 text-purple-300';
    case 'results': return 'border-red-500/30 text-red-300';
    default: return 'border-white/20 text-white';
  }
}

function getPhaseLabel(phase: string): string {
  switch (phase) {
    case 'intro': return 'Phase Intro';
    case 'answer': return 'Phase Réponse';
    case 'vote': return 'Phase Vote';
    case 'reveal': return 'Phase Révélation';
    case 'results': return 'Phase Résultats';
    default: return phase;
  }
}

export default DevSandbox;
