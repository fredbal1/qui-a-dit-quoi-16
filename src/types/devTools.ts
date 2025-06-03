
// Types pour les outils de développement et d'analyse

export interface MockDataItem {
  id: string;
  dataName: string;
  components: string[];
  dataType: string;
  currentOrigin: 'mock' | 'placeholder' | 'empty-state' | 'hardcoded';
  associatedLogic: string;
  priority: 'high' | 'medium' | 'low';
  connectionStatus: 'to-connect' | 'connected' | 'in-progress';
  description?: string;
}

export interface SuggestedTable {
  id: string;
  tableName: string;
  description: string;
  columns: SuggestedColumn[];
  relationships: TableRelationship[];
}

export interface SuggestedColumn {
  name: string;
  type: string;
  constraints: string[];
  description: string;
  isRequired: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: string;
}

export interface TableRelationship {
  type: 'one-to-many' | 'many-to-many' | 'one-to-one';
  targetTable: string;
  description: string;
}

export interface RLSPolicy {
  tableName: string;
  policyName: string;
  description: string;
  sqlCode: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
}

export interface ArchitectureNode {
  id: string;
  type: 'component' | 'logic' | 'table';
  name: string;
  status: 'connected' | 'not-connected' | 'planned';
  description?: string;
  details?: any;
}

export interface ArchitectureLink {
  source: string;
  target: string;
  type: 'calls' | 'reads' | 'writes' | 'updates';
  description: string;
}
