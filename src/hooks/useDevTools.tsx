
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DevToolsAction } from '@/types/mockWizard';

export function useDevTools() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createTestGame = async () => {
    setIsLoading(true);
    try {
      // Ici on créerait directement une partie de test via Supabase
      // Pour l'instant, on simule l'action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Partie de test créée",
        description: "Code: TEST123",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la partie de test",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinGameForced = async (code: string) => {
    setIsLoading(true);
    try {
      // Force join sans validation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Partie rejointe",
        description: `Connecté à la partie ${code}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre la partie",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFakePlayer = async (gameId: string, pseudo: string) => {
    setIsLoading(true);
    try {
      // Ajout d'un joueur fictif pour les tests
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Joueur ajouté",
        description: `${pseudo} a rejoint la partie`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le joueur fictif",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forceGamePhase = async (gameId: string, phase: string) => {
    setIsLoading(true);
    try {
      // Force une phase spécifique
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Phase forcée",
        description: `Jeu maintenant en phase: ${phase}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de forcer la phase",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const devActions: DevToolsAction[] = [
    {
      id: 'create-test-game',
      name: 'Créer partie test',
      description: 'Créer une partie de test en 1 clic',
      category: 'game',
      action: createTestGame
    },
    {
      id: 'add-fake-player',
      name: 'Ajouter joueur fictif',
      description: 'Ajouter un bot/joueur fictif à la partie',
      category: 'players',
      action: () => addFakePlayer('test', 'Bot_Player')
    },
    {
      id: 'force-vote-phase',
      name: 'Forcer phase vote',
      description: 'Passer directement à la phase de vote',
      category: 'game',
      action: () => forceGamePhase('test', 'vote')
    },
    {
      id: 'force-reveal-phase',
      name: 'Forcer phase reveal',
      description: 'Passer directement à la révélation',
      category: 'game',
      action: () => forceGamePhase('test', 'reveal')
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
