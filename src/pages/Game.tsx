
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameData } from '@/hooks/useGameData';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import AnimatedBackground from '@/components/AnimatedBackground';
import KiKaDiGame from '@/components/games/KiKaDiGame';
import KiDiVraiGame from '@/components/games/KiDiVraiGame';
import KiDejaGame from '@/components/games/KiDejaGame';
import KiDeNousGame from '@/components/games/KiDeNousGame';
import GameResults from '@/components/games/GameResults';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Game = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { game, players, currentPlayer, isLoading } = useGameData(gameId);
  useRealtimeGame(gameId);

  const [gamePhase, setGamePhase] = useState<'playing' | 'results'>('playing');
  const [scores, setScores] = useState<Record<string, number>>({});

  const games = ['kikadi', 'kidivrai', 'kideja', 'kidenous'];

  // Redirect if not in game or game doesn't exist
  useEffect(() => {
    if (!isLoading && gameId && (!game || !currentPlayer)) {
      navigate('/dashboard');
    }
  }, [game, currentPlayer, isLoading, gameId, navigate]);

  // Initialize scores when players change
  useEffect(() => {
    if (players.length > 0) {
      const initialScores: Record<string, number> = {};
      players.forEach(player => {
        initialScores[player.user_id] = player.score || 0;
      });
      setScores(initialScores);
    }
  }, [players]);

  const handleGameComplete = (roundScores: Record<string, number>) => {
    // Update total scores
    setScores(prev => {
      const newScores = { ...prev };
      Object.keys(roundScores).forEach(playerId => {
        newScores[playerId] = (newScores[playerId] || 0) + (roundScores[playerId] || 0);
      });
      return newScores;
    });

    // Check if game is over
    if (game && game.current_round >= game.total_rounds) {
      setGamePhase('results');
    }
  };

  const renderCurrentGame = () => {
    if (!game) return null;

    const gameIndex = (game.current_round - 1) % games.length;
    const currentGame = games[gameIndex];

    const commonProps = {
      onComplete: handleGameComplete,
      currentRound: game.current_round,
      totalRounds: game.total_rounds,
      players: players.map(p => ({
        id: p.user_id,
        pseudo: p.profiles?.pseudo || 'Joueur',
        avatar: p.profiles?.avatar_url || '🎮'
      }))
    };

    switch (currentGame) {
      case 'kikadi':
        return <KiKaDiGame {...commonProps} />;
      case 'kidivrai':
        return <KiDiVraiGame {...commonProps} />;
      case 'kideja':
        return <KiDejaGame {...commonProps} />;
      case 'kidenous':
        return <KiDeNousGame {...commonProps} />;
      default:
        return <KiKaDiGame {...commonProps} />;
    }
  };

  if (isLoading) {
    return (
      <AnimatedBackground variant="game">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
        </div>
      </AnimatedBackground>
    );
  }

  if (!game || !currentPlayer) {
    return null;
  }

  if (gamePhase === 'results') {
    return <GameResults scores={scores} onRestart={() => navigate('/dashboard')} />;
  }

  return (
    <AnimatedBackground variant="game">
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 relative z-20">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <div className="text-white font-poppins font-semibold">
              Manche {game.current_round}/{game.total_rounds}
            </div>
            <div className="text-white/80 text-sm">
              Partie {game.code}
            </div>
          </div>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        {/* Game Content */}
        <div className="relative z-10">
          {renderCurrentGame()}
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Game;
