
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameManagement } from '@/hooks/useGameManagement';
import { useAuth } from '@/hooks/useAuth';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Users, 
  Brain, 
  Zap, 
  Heart, 
  Shield, 
  Eye, 
  Clock,
  Play
} from 'lucide-react';

const CreateGame = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { createGame, isCreating } = useGameManagement();
  const [twoPlayersOnly, setTwoPlayersOnly] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [selectedAmbiance, setSelectedAmbiance] = useState<string>('');
  const [selectedMiniGames, setSelectedMiniGames] = useState<string[]>([]);
  const [rounds, setRounds] = useState([5]);

  // Debug: Log auth state on component mount
  React.useEffect(() => {
    console.log('🔐 [CREATE GAME PAGE] Auth state:', { 
      user: !!user, 
      userId: user?.id, 
      profile: !!profile,
      pseudo: profile?.pseudo 
    });
  }, [user, profile]);

  const modes = [
    {
      id: 'classique',
      title: 'Classique',
      icon: <Users className="w-6 h-6" />,
      description: 'Le mode traditionnel pour tous',
      available: !twoPlayersOnly
    },
    {
      id: 'bluff',
      title: 'Bluff',
      icon: <Brain className="w-6 h-6" />,
      description: 'Ments et découvre les menteurs',
      emoji: '🕵️',
      available: !twoPlayersOnly
    },
    {
      id: 'duel',
      title: 'Duel',
      icon: <Zap className="w-6 h-6" />,
      description: 'Face à face épique',
      emoji: '⚔️',
      available: twoPlayersOnly
    },
    {
      id: 'couple',
      title: 'Couple',
      icon: <Heart className="w-6 h-6" />,
      description: 'Spécial amoureux',
      emoji: '❤️',
      available: twoPlayersOnly
    }
  ];

  const ambiances = [
    {
      id: 'safe',
      title: 'Safe',
      emoji: '✅',
      description: 'Familial et bienveillant',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'intime',
      title: 'Intime',
      emoji: '💞',
      description: 'Questions plus personnelles',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'nofilter',
      title: 'No Filter',
      emoji: '🔞',
      description: 'Sans limites, attention !',
      color: 'from-red-500 to-orange-500'
    }
  ];

  const miniGames = [
    {
      id: 'kikadi',
      title: 'KiKaDi',
      emoji: '🧠',
      description: 'Devinez qui a écrit quoi'
    },
    {
      id: 'kidivrai',
      title: 'KiDiVrai',
      emoji: '😏',
      description: 'Vérité ou bluff ?'
    },
    {
      id: 'kideja',
      title: 'KiDéjà',
      emoji: '🤭',
      description: 'Qui a déjà fait ça ?'
    },
    {
      id: 'kidenous',
      title: 'KiDeNous',
      emoji: '😱',
      description: 'Qui de nous correspond ?'
    }
  ];

  const toggleMiniGame = (gameId: string) => {
    setSelectedMiniGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const getEstimatedTime = () => {
    const baseTime = 3; // 3 minutes par manche
    return rounds[0] * baseTime;
  };

  const canCreateGame = selectedMode && selectedAmbiance && selectedMiniGames.length > 0;

  const handleCreateGame = () => {
    console.log('🚀 [CREATE GAME PAGE] Create game button clicked');
    console.log('📊 [CREATE GAME PAGE] Current form state:', {
      selectedMode,
      selectedAmbiance,
      selectedMiniGames,
      rounds: rounds[0],
      twoPlayersOnly,
      canCreateGame
    });

    if (!user || !profile) {
      console.error('❌ [CREATE GAME PAGE] Cannot create game: user not authenticated');
      return;
    }

    if (canCreateGame) {
      const gameSettings = {
        mode: selectedMode,
        ambiance: selectedAmbiance,
        miniGames: selectedMiniGames,
        rounds: rounds[0],
        maxPlayers: twoPlayersOnly ? 2 : 8
      };

      console.log('✅ [CREATE GAME PAGE] Calling createGame with settings:', gameSettings);

      createGame(gameSettings, {
        onSuccess: () => {
          console.log('🎉 [CREATE GAME PAGE] Game created successfully, staying on create page temporarily');
          // TEMPORAIRE : Pas de navigation car on n'a pas l'ID du jeu
          // navigate(`/lobby/${game.id}`);
        },
        onError: (error) => {
          console.error('💥 [CREATE GAME PAGE] Game creation failed:', error);
        }
      });
    } else {
      console.warn('⚠️ [CREATE GAME PAGE] Cannot create game: form incomplete');
    }
  };

  return (
    <AnimatedBackground variant="create">
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-poppins font-bold text-white">
            Créer une partie
          </h1>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <GlassCard className="mb-6 bg-blue-500/20 border-blue-300/30">
            <div className="text-blue-100 text-sm">
              <div>🔐 Auth: {user ? '✅' : '❌'} | Profile: {profile ? '✅' : '❌'}</div>
              <div>📊 Form: Mode={selectedMode} | Ambiance={selectedAmbiance} | Games={selectedMiniGames.length}</div>
              <div>🎯 Can Create: {canCreateGame ? '✅' : '❌'} | Creating: {isCreating ? '⏳' : '✅'}</div>
            </div>
          </GlassCard>
        )}

        {/* Two Players Switch */}
        <GlassCard className="mb-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-poppins font-semibold">
                Mode 2 joueurs uniquement
              </Label>
              <p className="text-white/80 text-sm font-inter mt-1">
                Active pour débloquer Duel et Couple
              </p>
            </div>
            <Switch
              checked={twoPlayersOnly}
              onCheckedChange={(checked) => {
                setTwoPlayersOnly(checked);
                setSelectedMode('');
              }}
            />
          </div>
        </GlassCard>

        {/* Game Modes */}
        <div className="mb-6">
          <h2 className="text-xl font-poppins font-semibold text-white mb-4">
            Mode de jeu
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {modes.filter(mode => mode.available).map((mode) => (
              <GlassCard
                key={mode.id}
                hover
                onClick={() => setSelectedMode(mode.id)}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMode === mode.id 
                    ? 'ring-2 ring-white bg-white/30' 
                    : ''
                }`}
              >
                <div className="text-center">
                  <div className="flex justify-center items-center mb-3">
                    {mode.icon}
                    {mode.emoji && <span className="ml-2 text-2xl">{mode.emoji}</span>}
                  </div>
                  <h3 className="font-poppins font-semibold text-white mb-1">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-white/80 font-inter">
                    {mode.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Ambiance */}
        <div className="mb-6">
          <h2 className="text-xl font-poppins font-semibold text-white mb-4">
            Ambiance
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {ambiances.map((ambiance) => (
              <GlassCard
                key={ambiance.id}
                hover
                onClick={() => setSelectedAmbiance(ambiance.id)}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedAmbiance === ambiance.id 
                    ? 'ring-2 ring-white bg-white/30' 
                    : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${ambiance.color} flex items-center justify-center text-2xl`}>
                    {ambiance.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-poppins font-semibold text-white">
                      {ambiance.title}
                    </h3>
                    <p className="text-sm text-white/80 font-inter">
                      {ambiance.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Mini-Games Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-poppins font-semibold text-white mb-4">
            Mini-jeux ({selectedMiniGames.length}/4)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {miniGames.map((game) => (
              <GlassCard
                key={game.id}
                hover
                onClick={() => toggleMiniGame(game.id)}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMiniGames.includes(game.id)
                    ? 'ring-2 ring-white bg-white/30' 
                    : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{game.emoji}</div>
                  <h3 className="font-poppins font-semibold text-white mb-1">
                    {game.title}
                  </h3>
                  <p className="text-xs text-white/80 font-inter">
                    {game.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Rounds */}
        <GlassCard className="mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-white font-poppins font-semibold">
                Nombre de manches
              </Label>
              <span className="text-white font-poppins font-bold text-lg">
                {rounds[0]}
              </span>
            </div>
            <Slider
              value={rounds}
              onValueChange={setRounds}
              max={15}
              min={3}
              step={1}
              className="w-full"
            />
            <div className="flex items-center space-x-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-inter">
                Durée estimée : ~{getEstimatedTime()} minutes
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Create Button */}
        <Button
          onClick={handleCreateGame}
          disabled={!canCreateGame || isCreating}
          className="w-full glass-button text-white border-white/30 hover:bg-white/20 text-lg py-6 font-poppins font-semibold"
        >
          {isCreating ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
              Création en cours...
            </>
          ) : (
            <>
              <Play className="mr-3 w-6 h-6" />
              Lancer la partie 🚀
            </>
          )}
        </Button>
      </div>
    </AnimatedBackground>
  );
};

export default CreateGame;
