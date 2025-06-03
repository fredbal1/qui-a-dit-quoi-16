
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { DevToolsAction } from '@/types/mockWizard';

export function useDevTools() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createTestGame = async (): Promise<void> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une partie test",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create test game with required code field
      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert({
          host_id: user.id,
          mode: 'classique',
          ambiance: 'safe',
          total_rounds: 3,
          max_players: 4,
          code: '' // Will be replaced by trigger
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Add host as player
      const { error: playerError } = await supabase
        .from('players')
        .insert({
          game_id: game.id,
          user_id: user.id,
          is_host: true
        });

      if (playerError) throw playerError;

      // Create fake users with valid UUIDs
      const fakeUserIds = [
        crypto.randomUUID(),
        crypto.randomUUID()
      ];

      const fakeUsers = [
        { id: fakeUserIds[0], pseudo: 'TestBot1', avatar_url: '🤖' },
        { id: fakeUserIds[1], pseudo: 'TestBot2', avatar_url: '🎯' }
      ];

      for (const fakeUser of fakeUsers) {
        // Create fake profile with valid ID and all required fields
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: fakeUser.id,
            pseudo: fakeUser.pseudo,
            avatar_url: fakeUser.avatar_url,
            xp: 0,
            level: 1,
            coins: 50
          });

        if (profileError) {
          console.log('Profile creation failed:', profileError);
          continue;
        }

        // Add as player
        await supabase
          .from('players')
          .insert({
            game_id: game.id,
            user_id: fakeUser.id,
            is_host: false
          });
      }

      toast({
        title: "Partie de test créée !",
        description: `Code: ${game.code} avec 3 joueurs`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la partie de test",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinGameForced = async (code: string): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: game } = await supabase
        .from('games')
        .select('id')
        .eq('code', code.toUpperCase())
        .single();

      if (!game) throw new Error('Partie non trouvée');

      await supabase
        .from('players')
        .insert({
          game_id: game.id,
          user_id: user.id,
          is_host: false
        });

      toast({
        title: "Partie rejointe",
        description: `Connecté à la partie ${code}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejoindre la partie",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFakePlayer = async (gameId: string, pseudo: string): Promise<void> => {
    setIsLoading(true);
    try {
      const fakeUserId = crypto.randomUUID();

      // Create fake profile with valid ID and all required fields
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: fakeUserId,
          pseudo: pseudo,
          avatar_url: '🤖',
          xp: 0,
          level: 1,
          coins: 50
        });

      if (profileError) throw profileError;

      // Add as player
      const { error: playerError } = await supabase
        .from('players')
        .insert({
          game_id: gameId,
          user_id: fakeUserId,
          is_host: false
        });

      if (playerError) throw playerError;

      toast({
        title: "Joueur ajouté",
        description: `${pseudo} a rejoint la partie`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le joueur fictif",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forceGamePhase = async (gameId: string, phase: string): Promise<void> => {
    setIsLoading(true);
    try {
      const updateData: any = {};
      
      if (phase === 'active') {
        updateData.status = 'active';
        updateData.started_at = new Date().toISOString();
      } else if (phase === 'finished') {
        updateData.status = 'finished';
        updateData.finished_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('games')
        .update(updateData)
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Phase forcée",
        description: `Jeu maintenant en phase: ${phase}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de forcer la phase",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const devActions: DevToolsAction[] = [
    {
      id: 'create-test-game',
      name: 'Créer partie test complète',
      description: 'Créer une partie avec 3 joueurs (vous + 2 bots)',
      category: 'game',
      action: createTestGame
    },
    {
      id: 'add-fake-player',
      name: 'Ajouter joueur fictif',
      description: 'Ajouter un bot à la dernière partie créée',
      category: 'players',
      action: async () => {
        await addFakePlayer('test', 'TestBot_' + Date.now());
      }
    }
  ];

  return {
    devActions,
    isLoading,
    createTestGame,
    joinGameForced,
    addFakePlayer,
    forceGamePhase
  };
}
