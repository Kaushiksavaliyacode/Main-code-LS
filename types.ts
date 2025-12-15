export interface MaterialParams {
  sizer: number;
  micron: number;
  rpm: number;
  ls3: number;
  weight: number;
}

export interface AppState {
  current: MaterialParams;
  set: Partial<MaterialParams>;
  isCustomLS3: boolean;
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