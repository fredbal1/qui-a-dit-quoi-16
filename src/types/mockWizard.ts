
export interface MockItem {
  id: string;
  name: string;
  filePath: string;
  type: 'data' | 'component' | 'function';
  usedInComponents: string[];
  suggestedReplacement: {
    type: 'useQuery' | 'useMutation' | 'useState' | 'useEffect';
    table?: string;
    operation?: 'select' | 'insert' | 'update' | 'delete';
    code: string;
  };
  migrationStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
  dependencies: string[];
}

export interface MigrationStep {
  id: string;
  mockId: string;
  action: 'replace' | 'update-imports' | 'remove-file' | 'verify';
  status: 'pending' | 'completed' | 'failed';
  details: string;
}

export interface DevToolsAction {
  id: string;
  name: string;
  description: string;
  category: 'game' | 'players' | 'data' | 'testing';
  action: () => Promise<void>;
}
