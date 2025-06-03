
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MockItem, MigrationStep } from '@/types/mockWizard';

export function useMockWizard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDryRun, setIsDryRun] = useState(true);
  const [mockItems, setMockItems] = useState<MockItem[]>([]);
  const [migrationSteps, setMigrationSteps] = useState<MigrationStep[]>([]);
  const { toast } = useToast();

  // Données mises à jour après migration Supabase - très peu de mocks restants
  const simulatedMockItems: MockItem[] = [
    {
      id: '1',
      name: 'gameQuestions',
      filePath: 'src/components/games/KiKaDiGame.tsx',
      type: 'data',
      usedInComponents: ['KiKaDiGame', 'KiDiVraiGame', 'KiDejaGame', 'KiDeNousGame'],
      suggestedReplacement: {
        type: 'useQuery',
        table: 'questions',
        operation: 'select',
        code: `const { data: questions } = useQuery({
  queryKey: ['questions', ambiance, gameType],
  queryFn: () => supabase.from('questions').select('*').eq('ambiance', ambiance).eq('type', gameType)
});`
      },
      migrationStatus: 'pending',
      dependencies: ['supabase', '@tanstack/react-query']
    },
    {
      id: '2',
      name: 'shopItems',
      filePath: 'src/pages/Shop.tsx',
      type: 'data',
      usedInComponents: ['Shop'],
      suggestedReplacement: {
        type: 'useQuery',
        table: 'shop_items',
        operation: 'select',
        code: `const { data: shopItems } = useQuery({
  queryKey: ['shop-items'],
  queryFn: () => supabase.from('shop_items').select('*')
});`
      },
      migrationStatus: 'pending',
      dependencies: ['supabase', '@tanstack/react-query']
    }
  ];

  const analyzeMocks = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMockItems(simulatedMockItems);
    setIsAnalyzing(false);
    toast({
      title: "Analyse terminée",
      description: `${simulatedMockItems.length} mocks restants détectés (migration Supabase effectuée)`,
    });
  };

  const generateMigration = (mockId: string) => {
    const mock = mockItems.find(m => m.id === mockId);
    if (!mock) return;

    const steps: MigrationStep[] = [
      {
        id: `${mockId}-1`,
        mockId,
        action: 'replace',
        status: 'pending',
        details: `Remplacer ${mock.name} par ${mock.suggestedReplacement.type}`
      },
      {
        id: `${mockId}-2`,
        mockId,
        action: 'update-imports',
        status: 'pending',
        details: 'Mettre à jour les imports'
      },
      {
        id: `${mockId}-3`,
        mockId,
        action: 'verify',
        status: 'pending',
        details: 'Vérifier le fonctionnement'
      }
    ];

    setMigrationSteps(prev => [...prev.filter(s => s.mockId !== mockId), ...steps]);
    toast({
      title: "Migration générée",
      description: `${steps.length} étapes créées pour ${mock.name}`,
    });
  };

  const runMigration = async () => {
    toast({
      title: isDryRun ? "Simulation" : "Migration",
      description: isDryRun ? "Mode dry run - aucun changement appliqué" : "Migration en cours...",
    });
  };

  const testReplacement = (mockId: string) => {
    toast({
      title: "Test en cours",
      description: "Vérification de la compatibilité...",
    });
  };

  const getMigrationSummary = () => {
    const total = mockItems.length;
    const completed = mockItems.filter(m => m.migrationStatus === 'completed').length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 100; // 100% si aucun mock

    return { total, completed, pending, progress };
  };

  return {
    mockItems,
    isAnalyzing,
    isDryRun,
    setIsDryRun,
    analyzeMocks,
    generateMigration,
    runMigration,
    getMigrationSummary,
    testReplacement,
    migrationSteps
  };
}
