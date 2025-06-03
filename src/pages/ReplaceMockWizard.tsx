
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { useMockWizard } from '@/hooks/useMockWizard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  RefreshCw, 
  Code, 
  Database, 
  FilePlus, 
  FileX, 
  Play,
  Check,
  AlertTriangle,
  ArrowRightLeft,
  Eye
} from 'lucide-react';

const ReplaceMockWizard: React.FC = () => {
  const {
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
  } = useMockWizard();
  
  const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
  const summary = getMigrationSummary();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
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
                  Replace Mock Wizard 🧙‍♂️
                </h1>
                <p className="text-white/80 font-inter">
                  Assistant de migration des mocks vers Supabase
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={isDryRun} 
                    onCheckedChange={setIsDryRun}
                    id="dry-run"
                  />
                  <label htmlFor="dry-run" className="text-white text-sm cursor-pointer">
                    Mode Dry Run
                  </label>
                </div>
                
                <Button 
                  onClick={analyzeMocks} 
                  variant="outline" 
                  size="sm" 
                  className="border-white/20 text-white"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Analyser à nouveau
                    </>
                  )}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
        
        {/* Progress */}
        <GlassCard className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Progression de la migration
                </h2>
                <p className="text-white/60 text-sm">
                  {summary.completed} migrés sur {summary.total} mocks détectés
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {summary.progress}%
                </div>
                <div className="text-white/60 text-sm">
                  {summary.pending} restants
                </div>
              </div>
            </div>
            
            <Progress value={summary.progress} className="h-2" />
          </div>
        </GlassCard>
        
        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Liste des mocks détectés */}
          <div className="md:col-span-1">
            <GlassCard className="h-full">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-400" />
                Mocks détectés
              </h2>
              
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              ) : mockItems.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  Aucun mock détecté
                </div>
              ) : (
                <div className="space-y-3">
                  {mockItems.map(mock => (
                    <div
                      key={mock.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedMockId === mock.id
                          ? 'bg-white/20 border border-white/30'
                          : 'bg-white/10 hover:bg-white/15'
                      }`}
                      onClick={() => setSelectedMockId(mock.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-white">{mock.name}</div>
                        <Badge 
                          variant={mock.migrationStatus === 'completed' ? 'default' : 'outline'}
                          className={
                            mock.migrationStatus === 'completed' 
                              ? 'bg-green-500/20 text-green-300 border-green-300/30' 
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                          }
                        >
                          {mock.migrationStatus === 'completed' ? 'Migré' : 'En attente'}
                        </Badge>
                      </div>
                      
                      <div className="text-white/60 text-sm mt-1">
                        {mock.filePath}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mock.usedInComponents.map(comp => (
                          <Badge key={comp} variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-300/30">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
          
          {/* Détails et actions */}
          <div className="md:col-span-2">
            <GlassCard className="h-full">
              {selectedMockId ? (
                <DetailPanel 
                  mock={mockItems.find(m => m.id === selectedMockId)!} 
                  onGenerate={() => generateMigration(selectedMockId)}
                  onTest={() => testReplacement(selectedMockId)}
                  migrationSteps={migrationSteps.filter(s => s.mockId === selectedMockId)}
                  onRunMigration={runMigration}
                  isDryRun={isDryRun}
                />
              ) : (
                <div className="text-center py-10">
                  <div className="text-white/60 mb-4">
                    Sélectionnez un mock pour voir les détails et actions
                  </div>
                  <Button variant="outline" onClick={analyzeMocks}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Analyser les mocks
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailPanelProps {
  mock: any;
  onGenerate: () => void;
  onTest: () => void;
  onRunMigration: () => void;
  migrationSteps: any[];
  isDryRun: boolean;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ 
  mock, 
  onGenerate, 
  onTest,
  onRunMigration,
  migrationSteps,
  isDryRun
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Code className="w-5 h-5 mr-2 text-purple-400" />
          Détails de {mock.name}
        </h2>
        
        <Badge 
          variant="outline" 
          className={`${
            mock.type === 'data' 
              ? 'bg-blue-500/20 text-blue-300 border-blue-300/30' 
              : 'bg-green-500/20 text-green-300 border-green-300/30'
          }`}
        >
          {mock.type === 'data' ? 'Données' : 'Composant'}
        </Badge>
      </div>
      
      <Tabs defaultValue="replacement">
        <TabsList className="bg-white/10">
          <TabsTrigger value="replacement">Remplacement</TabsTrigger>
          <TabsTrigger value="migration">Migration</TabsTrigger>
          <TabsTrigger value="dependencies">Dépendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="replacement" className="pt-4">
          <Card className="bg-slate-900/50 border-white/10 p-4">
            <h3 className="text-lg text-white font-medium mb-2">
              Remplacement suggéré:
            </h3>
            
            <div className="bg-slate-800/70 rounded-md p-3 font-mono text-sm text-green-300 overflow-x-auto">
              {mock.suggestedReplacement.code}
            </div>
            
            <div className="flex items-center mt-4 justify-between">
              <div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-300/30">
                  {mock.suggestedReplacement.type}
                </Badge>
                {mock.suggestedReplacement.table && (
                  <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-300/30">
                    {mock.suggestedReplacement.table}
                  </Badge>
                )}
              </div>
              
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={onTest}>
                  <Eye className="w-4 h-4 mr-2" />
                  Tester
                </Button>
                
                {migrationSteps.length === 0 && (
                  <Button size="sm" onClick={onGenerate}>
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Générer migration
                  </Button>
                )}
              </div>
            </div>
          </Card>
          
          <div className="mt-4">
            <h3 className="text-lg text-white font-medium mb-2">
              Utilisé dans {mock.usedInComponents.length} composants:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mock.usedInComponents.map(comp => (
                <div 
                  key={comp} 
                  className="bg-white/10 rounded-md p-2 text-white flex items-center"
                >
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  {comp}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="migration" className="pt-4">
          {migrationSteps.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-white/60 mb-4">
                Aucune étape de migration générée
              </div>
              <Button onClick={onGenerate}>
                <FilePlus className="w-4 h-4 mr-2" />
                Générer migration
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {migrationSteps.map((step) => (
                  <div 
                    key={step.id} 
                    className="bg-white/10 rounded-md p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {step.status === 'completed' ? (
                        <Check className="w-5 h-5 text-green-400 mr-3" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-white/30 rounded-full mr-3"></div>
                      )}
                      <span className="text-white">{step.details}</span>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={
                        step.status === 'completed' 
                          ? 'bg-green-500/20 text-green-300 border-green-300/30' 
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                      }
                    >
                      {step.status === 'completed' ? 'Terminé' : 'En attente'}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-white/60 text-sm">
                  {isDryRun ? 
                    'En mode Dry Run: aucun changement ne sera appliqué' : 
                    'Attention: les changements seront appliqués'}
                </div>
                
                <Button onClick={onRunMigration}>
                  <Play className="w-4 h-4 mr-2" />
                  {isDryRun ? 'Simuler la migration' : 'Exécuter la migration'}
                </Button>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="dependencies" className="pt-4">
          <div className="bg-slate-900/50 border border-white/10 rounded-md p-4">
            <h3 className="text-lg text-white font-medium mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Impact potentiel
            </h3>
            
            <p className="text-white/70 mb-4">
              La migration de ce mock pourrait affecter les fichiers suivants:
            </p>
            
            <div className="space-y-2">
              {mock.usedInComponents.map(comp => (
                <div 
                  key={comp} 
                  className="bg-white/10 rounded-md p-3 flex items-center justify-between"
                >
                  <span className="text-white">{comp}</span>
                  
                  <Badge 
                    variant="outline" 
                    className="bg-yellow-500/20 text-yellow-300 border-yellow-300/30"
                  >
                    Impact moyen
                  </Badge>
                </div>
              ))}
              
              <div 
                className="bg-white/10 rounded-md p-3 flex items-center justify-between"
              >
                <span className="text-white">{mock.filePath}</span>
                
                <Badge 
                  variant="outline" 
                  className="bg-red-500/20 text-red-300 border-red-300/30"
                >
                  À supprimer
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReplaceMockWizard;
