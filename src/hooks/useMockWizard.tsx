
import { useState, useEffect } from 'react';
import { MockItem, MigrationStep } from '@/types/mockWizard';
import { useToast } from '@/hooks/use-toast';

export function useMockWizard() {
  const [mockItems, setMockItems] = useState<MockItem[]>([]);
  const [migrationSteps, setMigrationSteps] = useState<MigrationStep[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDryRun, setIsDryRun] = useState(true);
  const { toast } = useToast();

  // Analyse automatique des mocks détectés dans KIADISA
  const analyzeMocks = async () => {
    setIsAnalyzing(true);
    
    // Simulation de l'analyse basée sur les mocks identifiés
    const detectedMocks: MockItem[] = [
      {
        id: 'mock-user-1',
        name: 'mockUser',
        filePath: 'src/pages/Dashboard.tsx',
        type: 'data',
        usedInComponents: ['Dashboard', 'Header', 'UserProfile'],
        suggestedReplacement: {
          type: 'useQuery',
          table: 'profiles',
          operation: 'select',
          code: `const { data: profile } = useQuery({
  queryKey: ['profile', user?.id],
  queryFn: () => supabase.from('profiles').select('*').eq('id', user?.id).single(),
  enabled: !!user?.id
})`
        },
        migrationStatus: 'completed', // Déjà migré dans l'étape précédente
        dependencies: []
      },
      {
        id: 'mock-games-1',
        name: 'mockGameState',
        filePath: 'src/pages/Game.tsx',
        type: 'data',
        usedInComponents: ['Game', 'Lobby', 'GameResults'],
        suggestedReplacement: {
          type: 'useQuery',
          table: 'games',
          operation: 'select',
          code: `const { data: gameState } = useQuery({
  queryKey: ['game', gameId],
  queryFn: () => supabase.from('games').select('*, players(*)').eq('id', gameId).single()
})`
        },
        migrationStatus: 'pending',
        dependencies: []
      },
      {
        id: 'mock-questions-1',
        name: 'mockQuestions',
        filePath: 'src/components/games/KiKaDiGame.tsx',
        type: 'data',
        usedInComponents: ['KiKaDiGame', 'KiDiVraiGame', 'CreateGame'],
        suggestedReplacement: {
          type: 'useQuery',
          table: 'questions',
          operation: 'select',
          code: `const { data: questions } = useQuery({
  queryKey: ['questions', gameType, ambiance],
  queryFn: () => supabase.from('questions').select('*').eq('game_type', gameType).eq('ambiance', ambiance)
})`
        },
        migrationStatus: 'pending',
        dependencies: []
      },
      {
        id: 'mock-shop-1',
        name: 'mockShopItems',
        filePath: 'src/pages/Shop.tsx',
        type: 'data',
        usedInComponents: ['Shop'],
        suggestedReplacement: {
          type: 'useQuery',
          table: 'shop_items',
          operation: 'select',
          code: `const { data: shopItems } = useQuery({
  queryKey: ['shop_items'],
  queryFn: () => supabase.from('shop_items').select('*')
})`
        },
        migrationStatus: 'pending',
        dependencies: []
      }
    ];
    
    // Delay pour simuler l'analyse
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setMockItems(detectedMocks);
    setIsAnalyzing(false);
  };

  // Générer la migration pour un mock spécifique
  const generateMigration = (mockId: string) => {
    const mock = mockItems.find(item => item.id === mockId);
    if (!mock) return;
    
    const newSteps: MigrationStep[] = [
      {
        id: `step-${mockId}-1`,
        mockId,
        action: 'replace',
        status: 'pending',
        details: `Remplacer ${mock.name} par ${mock.suggestedReplacement.type} dans ${mock.filePath}`
      },
      {
        id: `step-${mockId}-2`,
        mockId,
        action: 'update-imports',
        status: 'pending',
        details: `Mettre à jour les imports dans ${mock.usedInComponents.join(', ')}`
      },
      {
        id: `step-${mockId}-3`,
        mockId,
        action: 'verify',
        status: 'pending',
        details: `Vérifier qu'aucune référence à ${mock.name} n'existe encore`
      },
      {
        id: `step-${mockId}-4`,
        mockId,
        action: 'remove-file',
        status: 'pending',
        details: `Supprimer le fichier de mock ${mock.filePath} si plus aucune dépendance`
      }
    ];
    
    setMigrationSteps(prev => [...prev, ...newSteps]);
  };

  // Exécute la migration complète (ou simulation si dryRun activé)
  const runMigration = async () => {
    if (migrationSteps.length === 0) {
      toast({
        title: "Aucune étape de migration",
        description: "Générez d'abord une migration pour un mock",
        variant: "destructive"
      });
      return;
    }
    
    // Pour chaque étape, simule l'exécution
    for (const step of migrationSteps) {
      if (step.status !== 'pending') continue;
      
      // Simuler l'action selon le type d'étape
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En dry run, on montre juste ce qui serait fait
      if (isDryRun) {
        toast({
          title: "Dry run",
          description: `Simulation: ${step.details}`,
          variant: "default"
        });
      } else {
        // En mode réel, on applique vraiment les changements (pas implémenté ici)
        toast({
          title: "Migration",
          description: step.details,
          variant: "default"
        });
      }
      
      // Mise à jour du statut de l'étape
      setMigrationSteps(prev => 
        prev.map(s => s.id === step.id ? { ...s, status: 'completed' } : s)
      );
      
      // Mise à jour du statut du mock
      const mockId = step.mockId;
      if (step.action === 'remove-file') {
        setMockItems(prev => 
          prev.map(m => m.id === mockId ? { ...m, migrationStatus: 'completed' } : m)
        );
      }
    }
    
    toast({
      title: isDryRun ? "Dry run terminé" : "Migration terminée",
      description: `${migrationSteps.length} étapes exécutées`,
      variant: "default"
    });
  };

  // Résumé de la migration
  const getMigrationSummary = () => {
    const completed = mockItems.filter(m => m.migrationStatus === 'completed').length;
    const pending = mockItems.filter(m => m.migrationStatus === 'pending').length;
    const total = mockItems.length;
    
    return {
      total,
      completed,
      pending,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  // Méthode pour tester une migration spécifique
  const testReplacement = (mockId: string) => {
    const mock = mockItems.find(item => item.id === mockId);
    if (!mock) return;
    
    toast({
      title: "Test de remplacement",
      description: `Code à remplacer:\n${mock.suggestedReplacement.code}`,
    });
  };

  // Chargement initial
  useEffect(() => {
    analyzeMocks();
  }, []);

  return {
    mockItems,
    migrationSteps,
    isAnalyzing,
    isDryRun,
    setIsDryRun,
    analyzeMocks,
    generateMigration,
    runMigration,
    getMigrationSummary,
    testReplacement
  };
}
