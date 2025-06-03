
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Database, 
  Download, 
  Copy,
  Table,
  Key,
  Link as LinkIcon,
  Code
} from 'lucide-react';
import { SuggestedTable, SuggestedColumn } from '@/types/devTools';

const SupabaseSchemaPlanner: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [showSQL, setShowSQL] = useState(false);

  // Schéma suggéré basé sur KIADISA
  const suggestedTables: SuggestedTable[] = [
    {
      id: 'profiles',
      tableName: 'profiles',
      description: 'Profils utilisateurs avec stats et préférences',
      columns: [
        {
          name: 'id',
          type: 'UUID',
          constraints: ['PRIMARY KEY', 'DEFAULT gen_random_uuid()'],
          description: 'Identifiant unique du profil',
          isRequired: true,
          isPrimaryKey: true,
          isForeignKey: false
        },
        {
          name: 'user_id',
          type: 'UUID',
          constraints: ['REFERENCES auth.users(id)', 'UNIQUE', 'NOT NULL'],
          description: 'Référence vers auth.users de Supabase',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: true,
          references: 'auth.users(id)'
        },
        {
          name: 'pseudo',
          type: 'VARCHAR(50)',
          constraints: ['NOT NULL', 'UNIQUE'],
          description: 'Pseudo unique du joueur',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'avatar',
          type: 'VARCHAR(10)',
          constraints: ['NOT NULL', "DEFAULT '🎮'"],
          description: 'Emoji avatar du joueur',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'level',
          type: 'INTEGER',
          constraints: ['NOT NULL', 'DEFAULT 1'],
          description: 'Niveau du joueur',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'xp',
          type: 'INTEGER',
          constraints: ['NOT NULL', 'DEFAULT 0'],
          description: 'Points d\'expérience totaux',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'coins',
          type: 'INTEGER',
          constraints: ['NOT NULL', 'DEFAULT 0'],
          description: 'Pièces virtuelles du joueur',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'created_at',
          type: 'TIMESTAMPTZ',
          constraints: ['NOT NULL', 'DEFAULT NOW()'],
          description: 'Date de création du profil',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'updated_at',
          type: 'TIMESTAMPTZ',
          constraints: ['NOT NULL', 'DEFAULT NOW()'],
          description: 'Date de dernière mise à jour',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        }
      ],
      relationships: [
        {
          type: 'one-to-many',
          targetTable: 'games',
          description: 'Un profil peut être hôte de plusieurs parties'
        },
        {
          type: 'one-to-many',
          targetTable: 'players',
          description: 'Un profil peut jouer dans plusieurs parties'
        }
      ]
    },
    {
      id: 'games',
      tableName: 'games',
      description: 'Parties de jeu KIADISA',
      columns: [
        {
          name: 'id',
          type: 'UUID',
          constraints: ['PRIMARY KEY', 'DEFAULT gen_random_uuid()'],
          description: 'Identifiant unique de la partie',
          isRequired: true,
          isPrimaryKey: true,
          isForeignKey: false
        },
        {
          name: 'code',
          type: 'VARCHAR(6)',
          constraints: ['NOT NULL', 'UNIQUE'],
          description: 'Code de la partie (ex: ABC123)',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'host_id',
          type: 'UUID',
          constraints: ['REFERENCES profiles(id)', 'NOT NULL'],
          description: 'Hôte de la partie',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: true,
          references: 'profiles(id)'
        },
        {
          name: 'status',
          type: 'game_status_enum',
          constraints: ['NOT NULL', "DEFAULT 'waiting'"],
          description: 'Statut de la partie',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'mode',
          type: 'game_mode_enum',
          constraints: ['NOT NULL', "DEFAULT 'classique'"],
          description: 'Mode de jeu',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'ambiance',
          type: 'ambiance_enum',
          constraints: ['NOT NULL', "DEFAULT 'safe'"],
          description: 'Ambiance des questions',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'total_rounds',
          type: 'INTEGER',
          constraints: ['NOT NULL', 'DEFAULT 5'],
          description: 'Nombre total de manches',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'current_round',
          type: 'INTEGER',
          constraints: ['NOT NULL', 'DEFAULT 0'],
          description: 'Manche actuelle',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'max_players',
          type: 'INTEGER',
          constraints: ['NOT NULL', 'DEFAULT 8'],
          description: 'Nombre maximum de joueurs',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'created_at',
          type: 'TIMESTAMPTZ',
          constraints: ['NOT NULL', 'DEFAULT NOW()'],
          description: 'Date de création',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'started_at',
          type: 'TIMESTAMPTZ',
          constraints: [],
          description: 'Date de début de partie',
          isRequired: false,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'finished_at',
          type: 'TIMESTAMPTZ',
          constraints: [],
          description: 'Date de fin de partie',
          isRequired: false,
          isPrimaryKey: false,
          isForeignKey: false
        }
      ],
      relationships: [
        {
          type: 'one-to-many',
          targetTable: 'players',
          description: 'Une partie a plusieurs joueurs'
        },
        {
          type: 'one-to-many',
          targetTable: 'rounds',
          description: 'Une partie a plusieurs manches'
        }
      ]
    },
    {
      id: 'questions',
      tableName: 'questions',
      description: 'Questions pour les mini-jeux',
      columns: [
        {
          name: 'id',
          type: 'UUID',
          constraints: ['PRIMARY KEY', 'DEFAULT gen_random_uuid()'],
          description: 'Identifiant unique de la question',
          isRequired: true,
          isPrimaryKey: true,
          isForeignKey: false
        },
        {
          name: 'text',
          type: 'TEXT',
          constraints: ['NOT NULL'],
          description: 'Texte de la question',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'game_type',
          type: 'mini_game_enum',
          constraints: ['NOT NULL'],
          description: 'Type de mini-jeu',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'ambiance',
          type: 'ambiance_enum',
          constraints: ['NOT NULL'],
          description: 'Ambiance de la question',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'category',
          type: 'VARCHAR(50)',
          constraints: ['NOT NULL'],
          description: 'Catégorie de la question',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'is_active',
          type: 'BOOLEAN',
          constraints: ['NOT NULL', 'DEFAULT true'],
          description: 'Question active ou archivée',
          isRequired: true,
          isPrimaryKey: false,
          isForeignKey: false
        }
      ],
      relationships: [
        {
          type: 'one-to-many',
          targetTable: 'rounds',
          description: 'Une question peut être utilisée dans plusieurs manches'
        }
      ]
    }
  ];

  const enums = [
    {
      name: 'game_status_enum',
      values: ['waiting', 'playing', 'finished'],
      description: 'Statuts possibles d\'une partie'
    },
    {
      name: 'game_mode_enum',
      values: ['classique', 'bluff', 'duel', 'couple'],
      description: 'Modes de jeu disponibles'
    },
    {
      name: 'ambiance_enum',
      values: ['safe', 'intime', 'nofilter'],
      description: 'Ambiances des questions'
    },
    {
      name: 'mini_game_enum',
      values: ['kikadi', 'kidivrai', 'kideja', 'kidenous'],
      description: 'Types de mini-jeux'
    }
  ];

  const generateCompleteSQL = () => {
    let sql = '-- Script SQL complet pour KIADISA\n-- Généré automatiquement\n\n';
    
    // ENUMs
    sql += '-- ================================\n';
    sql += '-- CRÉATION DES TYPES ENUM\n';
    sql += '-- ================================\n\n';
    
    enums.forEach(enumDef => {
      sql += `-- ${enumDef.description}\n`;
      sql += `CREATE TYPE ${enumDef.name} AS ENUM (\n`;
      sql += enumDef.values.map(value => `  '${value}'`).join(',\n');
      sql += '\n);\n\n';
    });

    // Tables
    sql += '-- ================================\n';
    sql += '-- CRÉATION DES TABLES\n';
    sql += '-- ================================\n\n';

    suggestedTables.forEach(table => {
      sql += `-- ${table.description}\n`;
      sql += `CREATE TABLE ${table.tableName} (\n`;
      
      const columnDefs = table.columns.map(col => {
        let colDef = `  ${col.name} ${col.type}`;
        if (col.constraints.length > 0) {
          colDef += ' ' + col.constraints.join(' ');
        }
        return colDef;
      });
      
      sql += columnDefs.join(',\n');
      sql += '\n);\n\n';
    });

    // Index suggestions
    sql += '-- ================================\n';
    sql += '-- INDEX SUGGÉRÉS\n';
    sql += '-- ================================\n\n';
    
    sql += 'CREATE INDEX idx_games_code ON games(code);\n';
    sql += 'CREATE INDEX idx_games_host_id ON games(host_id);\n';
    sql += 'CREATE INDEX idx_games_status ON games(status);\n';
    sql += 'CREATE INDEX idx_profiles_user_id ON profiles(user_id);\n';
    sql += 'CREATE INDEX idx_profiles_pseudo ON profiles(pseudo);\n';
    sql += 'CREATE INDEX idx_questions_game_type_ambiance ON questions(game_type, ambiance);\n\n';

    // Triggers
    sql += '-- ================================\n';
    sql += '-- TRIGGERS POUR updated_at\n';
    sql += '-- ================================\n\n';
    
    sql += `CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';\n\n`;

    sql += 'CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();\n\n';

    return sql;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-4">
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
                  Planificateur de Schéma Supabase 🗄️
                </h1>
                <p className="text-white/80 font-inter">
                  Structure de base de données optimisée pour KIADISA
                </p>
              </div>
              <Database className="w-12 h-12 text-green-300" />
            </div>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tables List */}
          <div className="lg:col-span-1">
            <GlassCard>
              <h2 className="text-xl font-poppins font-semibold text-white mb-4">
                Tables Suggérées
              </h2>
              
              <div className="space-y-2">
                {suggestedTables.map(table => (
                  <div
                    key={table.id}
                    onClick={() => setSelectedTable(selectedTable === table.id ? '' : table.id)}
                    className={`glass-card cursor-pointer transition-all duration-200 p-3 ${
                      selectedTable === table.id ? 'bg-green-500/20 border-green-300/30' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Table className="w-4 h-4 text-green-300" />
                          <span className="font-medium text-white">{table.tableName}</span>
                        </div>
                        <p className="text-white/60 text-xs mt-1">{table.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs border-green-300/30 text-green-200">
                        {table.columns.length} cols
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* ENUMs */}
            <GlassCard className="mt-6">
              <h3 className="text-lg font-poppins font-semibold text-white mb-4">
                Types ENUM Suggérés
              </h3>
              
              <div className="space-y-3">
                {enums.map(enumDef => (
                  <div key={enumDef.name} className="glass-card bg-white/5 p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Code className="w-4 h-4 text-purple-300" />
                      <span className="font-medium text-white text-sm">{enumDef.name}</span>
                    </div>
                    <p className="text-white/60 text-xs mb-2">{enumDef.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {enumDef.values.map(value => (
                        <Badge key={value} variant="outline" className="text-xs border-purple-300/30 text-purple-200">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Table Details */}
          <div className="lg:col-span-2">
            {selectedTable ? (
              <GlassCard>
                {(() => {
                  const table = suggestedTables.find(t => t.id === selectedTable);
                  if (!table) return null;

                  return (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-poppins font-semibold text-white">
                            Table: {table.tableName}
                          </h2>
                          <p className="text-white/70">{table.description}</p>
                        </div>
                        <Button
                          size="sm"
                          className="glass-button text-white border-white/30"
                          onClick={() => copyToClipboard(`CREATE TABLE ${table.tableName} ...`)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copier SQL
                        </Button>
                      </div>

                      {/* Columns */}
                      <div className="mb-6">
                        <h3 className="text-lg font-poppins font-semibold text-white mb-4">
                          Colonnes ({table.columns.length})
                        </h3>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/20">
                                <th className="text-left text-white/80 font-medium p-2">Nom</th>
                                <th className="text-left text-white/80 font-medium p-2">Type</th>
                                <th className="text-left text-white/80 font-medium p-2">Contraintes</th>
                                <th className="text-left text-white/80 font-medium p-2">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.columns.map(col => (
                                <tr key={col.name} className="border-b border-white/10">
                                  <td className="p-2">
                                    <div className="flex items-center space-x-2">
                                      {col.isPrimaryKey && <Key className="w-3 h-3 text-yellow-400" />}
                                      {col.isForeignKey && <LinkIcon className="w-3 h-3 text-blue-400" />}
                                      <span className="font-medium text-white">{col.name}</span>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <code className="text-green-300 text-sm bg-green-500/10 px-2 py-1 rounded">
                                      {col.type}
                                    </code>
                                  </td>
                                  <td className="p-2">
                                    <div className="flex flex-wrap gap-1">
                                      {col.constraints.map((constraint, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs border-blue-300/30 text-blue-200">
                                          {constraint}
                                        </Badge>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <span className="text-white/70 text-sm">{col.description}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Relationships */}
                      {table.relationships.length > 0 && (
                        <div>
                          <h3 className="text-lg font-poppins font-semibold text-white mb-4">
                            Relations
                          </h3>
                          
                          <div className="space-y-2">
                            {table.relationships.map((rel, idx) => (
                              <div key={idx} className="glass-card bg-white/5 p-3">
                                <div className="flex items-center space-x-2">
                                  <LinkIcon className="w-4 h-4 text-blue-300" />
                                  <span className="text-white font-medium">
                                    {rel.type} → {rel.targetTable}
                                  </span>
                                </div>
                                <p className="text-white/60 text-sm mt-1">{rel.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </GlassCard>
            ) : (
              <GlassCard className="text-center py-12">
                <Table className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-poppins font-semibold text-white mb-2">
                  Sélectionnez une table
                </h3>
                <p className="text-white/60">
                  Cliquez sur une table à gauche pour voir ses détails
                </p>
              </GlassCard>
            )}

            {/* SQL Generation */}
            <GlassCard className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-poppins font-semibold text-white">
                  Script SQL Complet
                </h3>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setShowSQL(!showSQL)}
                    className="glass-button text-white border-white/30"
                  >
                    {showSQL ? 'Masquer' : 'Afficher'} SQL
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(generateCompleteSQL())}
                    className="glass-button text-white border-green-300/30 hover:bg-green-500/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Générer & Copier
                  </Button>
                </div>
              </div>

              {showSQL && (
                <div className="glass-card bg-black/20 p-4 rounded-lg">
                  <pre className="text-green-300 text-sm whitespace-pre-wrap overflow-x-auto">
                    {generateCompleteSQL()}
                  </pre>
                </div>
              )}

              {!showSQL && (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">
                    Le script complet inclut toutes les tables, ENUMs, index et triggers
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSchemaPlanner;
