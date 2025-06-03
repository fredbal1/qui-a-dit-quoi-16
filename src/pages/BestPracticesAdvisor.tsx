
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Database,
  Lock,
  Zap,
  Settings,
  Copy,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { RLSPolicy } from '@/types/devTools';

const BestPracticesAdvisor: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('rls');

  const rlsPolicies: RLSPolicy[] = [
    {
      tableName: 'profiles',
      policyName: 'Users can view and edit own profile',
      description: 'Les utilisateurs ne peuvent voir et modifier que leur propre profil',
      operation: 'SELECT',
      sqlCode: `CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = user_id);`
    },
    {
      tableName: 'games',
      policyName: 'Game access control',
      description: 'Contrôle d\'accès aux parties selon le rôle et le statut',
      operation: 'SELECT',
      sqlCode: `-- Tous les utilisateurs authentifiés peuvent créer des parties
CREATE POLICY "Authenticated users can create games" ON games
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Les joueurs peuvent voir les parties où ils participent
CREATE POLICY "Players can view their games" ON games
FOR SELECT USING (
  auth.uid() IN (
    SELECT p.user_id FROM players p WHERE p.game_id = games.id
  ) OR auth.uid() = (SELECT user_id FROM profiles WHERE id = host_id)
);

-- Seul l'hôte peut modifier une partie en attente
CREATE POLICY "Host can update waiting games" ON games
FOR UPDATE USING (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = host_id)
  AND status = 'waiting'
);`
    },
    {
      tableName: 'answers',
      policyName: 'Answer submission and visibility',
      description: 'Contrôle des réponses : soumission unique et visibilité selon la phase',
      operation: 'INSERT',
      sqlCode: `-- Un joueur ne peut soumettre qu'une réponse par manche
CREATE POLICY "One answer per player per round" ON answers
FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = player_id)
  AND NOT EXISTS (
    SELECT 1 FROM answers a2 
    WHERE a2.player_id = answers.player_id 
    AND a2.round_id = answers.round_id
  )
);

-- Les joueurs peuvent voir leurs propres réponses
CREATE POLICY "Players can view own answers" ON answers
FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM profiles WHERE id = player_id)
);

-- Les réponses des autres sont visibles selon la phase de jeu
CREATE POLICY "Answers visible after reveal phase" ON answers
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM rounds r
    JOIN games g ON r.game_id = g.id
    WHERE r.id = answers.round_id
    AND r.phase IN ('reveal', 'results')
    AND auth.uid() IN (
      SELECT p.user_id FROM players p WHERE p.game_id = g.id
    )
  )
);`
    }
  ];

  const indexSuggestions = [
    {
      name: 'idx_games_code',
      table: 'games',
      columns: ['code'],
      description: 'Recherche rapide de parties par code',
      sql: 'CREATE INDEX idx_games_code ON games(code);',
      priority: 'high'
    },
    {
      name: 'idx_games_host_status',
      table: 'games',
      columns: ['host_id', 'status'],
      description: 'Requêtes sur les parties d\'un hôte par statut',
      sql: 'CREATE INDEX idx_games_host_status ON games(host_id, status);',
      priority: 'medium'
    },
    {
      name: 'idx_players_game_user',
      table: 'players',
      columns: ['game_id', 'user_id'],
      description: 'Vérification de participation à une partie',
      sql: 'CREATE INDEX idx_players_game_user ON players(game_id, user_id);',
      priority: 'high'
    },
    {
      name: 'idx_questions_type_ambiance',
      table: 'questions',
      columns: ['game_type', 'ambiance', 'is_active'],
      description: 'Sélection de questions par type et ambiance',
      sql: 'CREATE INDEX idx_questions_type_ambiance ON questions(game_type, ambiance, is_active);',
      priority: 'high'
    },
    {
      name: 'idx_answers_round_player',
      table: 'answers',
      columns: ['round_id', 'player_id'],
      description: 'Récupération des réponses par manche et joueur',
      sql: 'CREATE INDEX idx_answers_round_player ON answers(round_id, player_id);',
      priority: 'medium'
    }
  ];

  const functions = [
    {
      name: 'generate_game_code',
      description: 'Génère un code de partie unique et aléatoire',
      sql: `CREATE OR REPLACE FUNCTION generate_game_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Génère un code de 6 caractères alphanumériques
        code := UPPER(
            substring(
                encode(gen_random_bytes(4), 'base64'),
                1, 6
            )
        );
        
        -- Remplace les caractères non alphanumériques
        code := regexp_replace(code, '[^A-Z0-9]', 
            chr(65 + floor(random() * 26)::int), 'g');
        
        -- Vérifie l'unicité
        SELECT EXISTS(SELECT 1 FROM games WHERE games.code = code) INTO exists;
        
        IF NOT exists THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;`,
      usage: 'Utiliser dans un trigger BEFORE INSERT sur games'
    },
    {
      name: 'calculate_player_level',
      description: 'Calcule le niveau d\'un joueur basé sur son XP',
      sql: `CREATE OR REPLACE FUNCTION calculate_player_level(xp_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Formule : niveau = racine carrée de (XP / 100)
    RETURN GREATEST(1, FLOOR(SQRT(xp_points / 100.0))::INTEGER);
END;
$$ LANGUAGE plpgsql IMMUTABLE;`,
      usage: 'Utiliser dans un trigger pour mettre à jour automatiquement le niveau'
    },
    {
      name: 'update_updated_at',
      description: 'Met à jour automatiquement la colonne updated_at',
      sql: `CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables avec updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`,
      usage: 'Trigger automatique pour toutes les tables avec updated_at'
    }
  ];

  const generalPractices = [
    {
      category: 'Authentification',
      icon: Lock,
      practices: [
        'Configurer les fournisseurs OAuth (Google, Discord) pour une UX fluide',
        'Personnaliser les templates d\'email de confirmation',
        'Activer la confirmation d\'email obligatoire',
        'Configurer des redirections appropriées après connexion'
      ]
    },
    {
      category: 'Performance',
      icon: Zap,
      practices: [
        'Utiliser la mise en cache côté client avec React Query',
        'Implémenter la pagination pour les listes longues',
        'Utiliser les subscriptions Realtime avec parcimonie',
        'Optimiser les requêtes avec des jointures appropriées'
      ]
    },
    {
      category: 'Sécurité',
      icon: Shield,
      practices: [
        'Activer RLS sur toutes les tables sensibles',
        'Valider les données côté serveur avec des fonctions',
        'Limiter les requêtes par utilisateur (rate limiting)',
        'Chiffrer les données sensibles avant stockage'
      ]
    },
    {
      category: 'Maintenance',
      icon: Settings,
      practices: [
        'Utiliser des migrations versionnées',
        'Mettre en place des sauvegardes automatiques',
        'Monitorer les performances avec les métriques Supabase',
        'Documenter les politiques RLS et les fonctions'
      ]
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const categories = [
    { id: 'rls', name: 'Politiques RLS', icon: Shield },
    { id: 'indexes', name: 'Index', icon: Zap },
    { id: 'functions', name: 'Fonctions', icon: Database },
    { id: 'general', name: 'Bonnes Pratiques', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dev-tools" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux outils
          </Link>
          
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-poppins font-bold text-white mb-2">
                  Conseiller Bonnes Pratiques 🛡️
                </h1>
                <p className="text-white/80 font-inter">
                  Recommandations RLS, indexation et sécurité pour Supabase
                </p>
              </div>
              <Shield className="w-12 h-12 text-orange-300" />
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories */}
          <div className="lg:col-span-1">
            <GlassCard>
              <h2 className="text-xl font-poppins font-semibold text-white mb-4">
                Catégories
              </h2>
              
              <div className="space-y-2">
                {categories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`glass-card cursor-pointer transition-all duration-200 p-3 ${
                        selectedCategory === category.id ? 'bg-orange-500/20 border-orange-300/30' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-orange-300" />
                        <span className="font-medium text-white">{category.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* RLS Policies */}
            {selectedCategory === 'rls' && (
              <div className="space-y-6">
                <GlassCard>
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="w-6 h-6 text-orange-300" />
                    <h2 className="text-2xl font-poppins font-semibold text-white">
                      Politiques RLS Suggérées
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {rlsPolicies.map((policy, index) => (
                      <div key={index} className="glass-card bg-white/5 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white mb-1">
                              {policy.tableName} - {policy.policyName}
                            </h3>
                            <p className="text-white/70 text-sm">{policy.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-300/30">
                              {policy.operation}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => copyToClipboard(policy.sqlCode)}
                              className="glass-button text-white border-white/30"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="glass-card bg-black/20 p-3 rounded">
                          <pre className="text-green-300 text-xs whitespace-pre-wrap overflow-x-auto">
                            {policy.sqlCode}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Indexes */}
            {selectedCategory === 'indexes' && (
              <GlassCard>
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="w-6 h-6 text-orange-300" />
                  <h2 className="text-2xl font-poppins font-semibold text-white">
                    Index Suggérés
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {indexSuggestions.map((index, idx) => (
                    <div key={idx} className="glass-card bg-white/5 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-white">{index.name}</h3>
                            <Badge className={`${
                              index.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-300/30' :
                              'bg-yellow-500/20 text-yellow-300 border-yellow-300/30'
                            }`}>
                              {index.priority}
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">{index.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-white/60 text-xs">Table:</span>
                            <code className="text-blue-300 text-xs bg-blue-500/10 px-2 py-1 rounded">
                              {index.table}
                            </code>
                            <span className="text-white/60 text-xs">Colonnes:</span>
                            <code className="text-green-300 text-xs bg-green-500/10 px-2 py-1 rounded">
                              [{index.columns.join(', ')}]
                            </code>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(index.sql)}
                          className="glass-button text-white border-white/30"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="glass-card bg-black/20 p-3 rounded">
                        <pre className="text-green-300 text-xs">
                          {index.sql}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Functions */}
            {selectedCategory === 'functions' && (
              <GlassCard>
                <div className="flex items-center space-x-3 mb-6">
                  <Database className="w-6 h-6 text-orange-300" />
                  <h2 className="text-2xl font-poppins font-semibold text-white">
                    Fonctions PostgreSQL Utiles
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {functions.map((func, idx) => (
                    <div key={idx} className="glass-card bg-white/5 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white mb-1">{func.name}</h3>
                          <p className="text-white/70 text-sm mb-2">{func.description}</p>
                          <div className="flex items-center space-x-2">
                            <Info className="w-4 h-4 text-blue-300" />
                            <span className="text-blue-300 text-sm">{func.usage}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(func.sql)}
                          className="glass-button text-white border-white/30"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="glass-card bg-black/20 p-3 rounded">
                        <pre className="text-green-300 text-xs whitespace-pre-wrap overflow-x-auto">
                          {func.sql}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* General Practices */}
            {selectedCategory === 'general' && (
              <div className="space-y-6">
                {generalPractices.map((section, idx) => {
                  const IconComponent = section.icon;
                  return (
                    <GlassCard key={idx}>
                      <div className="flex items-center space-x-3 mb-4">
                        <IconComponent className="w-6 h-6 text-orange-300" />
                        <h3 className="text-xl font-poppins font-semibold text-white">
                          {section.category}
                        </h3>
                      </div>
                      
                      <div className="space-y-3">
                        {section.practices.map((practice, practiceIdx) => (
                          <div key={practiceIdx} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-white/80">{practice}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  );
                })}
                
                {/* Migration Reminder */}
                <GlassCard className="border-yellow-500/30 bg-yellow-500/10">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-poppins font-semibold text-yellow-100 mb-2">
                        Important : Migrations et Déploiement
                      </h3>
                      <div className="space-y-2 text-yellow-200/80 text-sm">
                        <p>• Toujours tester les politiques RLS en mode développement</p>
                        <p>• Utiliser des migrations versionnées pour tous les changements de schéma</p>
                        <p>• Sauvegarder la base avant d'appliquer des changements en production</p>
                        <p>• Monitorer les performances après ajout d'index ou de politiques</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestPracticesAdvisor;
