
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useGameData(gameId?: string) {
  const { user } = useAuth();

  // Get game details
  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      if (!gameId) return null;
      
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!gameId
  });

  // Get players in the game
  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ['players', gameId],
    queryFn: async () => {
      if (!gameId) return [];
      
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          profiles:user_id (
            pseudo,
            avatar_url
          )
        `)
        .eq('game_id', gameId)
        .order('joined_at');

      if (error) throw error;
      return data;
    },
    enabled: !!gameId
  });

  // Check if current user is host
  const isHost = game && user && game.host_id === user.id;

  // Check if current user is in the game
  const currentPlayer = players.find(p => p.user_id === user?.id);

  return {
    game,
    players,
    isHost,
    currentPlayer,
    isLoading: gameLoading || playersLoading
  };
}

export function useGameByCode(code?: string) {
  return useQuery({
    queryKey: ['game-by-code', code],
    queryFn: async () => {
      if (!code) return null;
      
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!code && code.length === 6
  });
}
