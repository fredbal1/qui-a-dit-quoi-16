
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameData } from '@/hooks/useGameData';
import { useGameManagement } from '@/hooks/useGameManagement';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import { useAuth } from '@/hooks/useAuth';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Users, Copy, Play, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Lobby = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { startGame, isStarting } = useGameManagement();
  
  const { game, players, isHost, currentPlayer, isLoading } = useGameData(gameId);
  useRealtimeGame(gameId);

  // Redirect if not in game or game doesn't exist
  useEffect(() => {
    if (!isLoading && gameId && (!game || !currentPlayer)) {
      navigate('/dashboard');
    }
  }, [game, currentPlayer, isLoading, gameId, navigate]);

  const copyGameCode = () => {
    if (game?.code) {
      navigator.clipboard.writeText(game.code);
      toast({
        title: "Code copié ! 📋",
        description: "Partage-le avec tes amis pour qu'ils rejoignent",
      });
    }
  };

  const shareGame = () => {
    if (navigator.share && game?.code) {
      navigator.share({
        title: 'KIADISA - Rejoins ma partie !',
        text: `Salut ! Rejoins ma partie KIADISA avec le code : ${game.code}`,
        url: window.location.href,
      });
    } else {
      copyGameCode();
    }
  };

  const handleStartGame = () => {
    if (isHost && gameId) {
      startGame(gameId, {
        onSuccess: () => {
          navigate(`/game/${gameId}`);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <AnimatedBackground variant="lobby">
        <div className="min-h-screen p-4 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
        </div>
      </AnimatedBackground>
    );
  }

  if (!game || !currentPlayer) {
    return null;
  }

  return (
    <AnimatedBackground variant="lobby">
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-poppins font-bold text-white">
              Salon d'attente
            </h1>
          </div>
          <Badge className="glass-card text-white border-white/30 font-mono tracking-wider">
            {game.code}
          </Badge>
        </div>

        {/* Game Code */}
        <GlassCard className="mb-6 text-center animate-bounce-in">
          <h2 className="text-lg font-poppins font-semibold text-white mb-3">
            Code de la partie
          </h2>
          <div className="text-3xl font-mono font-bold text-white mb-4 tracking-widest">
            {game.code}
          </div>
          <div className="flex space-x-3 justify-center">
            <Button
              onClick={copyGameCode}
              className="bg-white/20 border-white/50 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
            <Button
              onClick={shareGame}
              className="bg-white/20 border-white/50 text-white hover:bg-white/30 hover:scale-105 transition-all duration-200"
            >
              <Share className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </GlassCard>

        {/* Players List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-poppins font-semibold text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Joueurs ({players.length}/{game.max_players})
            </h2>
          </div>

          <div className="space-y-3">
            {players.map((player, index) => (
              <GlassCard 
                key={player.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl animate-float"
                         style={{ animationDelay: `${index * 0.5}s` }}>
                      {player.profiles?.avatar_url || '🎮'}
                    </div>
                    <div>
                      <h3 className="font-poppins font-semibold text-white flex items-center">
                        {player.profiles?.pseudo || 'Joueur'}
                        {player.is_host && (
                          <Crown className="ml-2 w-4 h-4 text-yellow-300" />
                        )}
                      </h3>
                      <p className="text-white/80 text-sm font-inter">
                        {player.is_host ? 'Créateur de la partie' : 'Joueur'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-inter">En ligne</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Start Game Button (Host Only) */}
        {isHost && (
          <Button
            onClick={handleStartGame}
            disabled={isStarting || players.length < 2}
            className="w-full glass-button text-white border-white/30 hover:bg-white/20 text-lg py-6 font-poppins font-semibold animate-pulse-glow"
          >
            {isStarting ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                Lancement...
              </>
            ) : (
              <>
                <Play className="mr-3 w-6 h-6" />
                Commencer la partie ! 🚀
              </>
            )}
          </Button>
        )}

        {/* Non-host message */}
        {!isHost && (
          <GlassCard className="text-center bg-blue-500/20 border-blue-300/30">
            <p className="text-blue-100 font-inter">
              👑 Seul le créateur de la partie peut la lancer
            </p>
          </GlassCard>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default Lobby;
