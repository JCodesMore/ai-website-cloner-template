// src/lib/data-guard/types.ts

export interface DataIssue {
  type: "missing_row" | "empty_field" | "wrong_value" | "dirty_data" | "orphan_ref";
  table: string;
  id?: number;
  field?: string;
  expected?: string;
  actual?: string;
}

export interface RepairResult {
  fixed: number;
  skipped: number;
  errors: string[];
}

export interface DataRule {
  name: string;
  severity: "error" | "warn";
  check: () => Promise<DataIssue[]>;
  repair?: (issues: DataIssue[]) => Promise<RepairResult>;
}

export interface DomainReport {
  domain: string;
  passed: string[];
  warnings: string[];
  errors: string[];
  autoFixed: number;
}

export interface DataReport {
  domains: DomainReport[];
  totalAutoFixed: number;
  totalWarnings: number;
}
