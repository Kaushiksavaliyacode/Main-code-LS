export interface MaterialParams {
  size: number;
  micron: number;
  tu1: number;
  tu2: number;
  tu3: number;
  rpm: number;
}

export interface FormulaConfig {
  tu2Offset: number;
  tu1Offset: number;
}

export interface AppState {
  current: MaterialParams;
  set: Partial<MaterialParams>;
  formulaConfig: FormulaConfig;
  isCustomCalc: boolean;
}

export enum RowType {
  INPUT = 'INPUT',
  READONLY = 'READONLY', // Fully calculated
  CALCULATED_INPUT = 'CALCULATED_INPUT', // Input that is calculated but read-only
}

export interface RowConfig {
  id: keyof MaterialParams;
  label: string;
  unit: string;
  type: RowType;
  step?: number;
  isInteger?: boolean;
}