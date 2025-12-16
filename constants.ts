import { MaterialParams, RowConfig, RowType, FormulaConfig } from './types';

export const DEFAULT_CURRENT: MaterialParams = {
  size: 510,
  micron: 40,
  tu1: 1300,
  tu2: 1200,
  rpm: 800,
  tu3: 1270,
};

export const DEFAULT_FORMULA_CONFIG: FormulaConfig = {
  tu2Offset: 70,   // TU2 = TU3 + 70
  tu1Offset: -100, // TU1 = TU2 - 100
};

export const ROW_CONFIGS: RowConfig[] = [
  { id: 'size', label: 'SIZE', unit: '', type: RowType.INPUT, step: 0.1 },
  { id: 'micron', label: 'MICRON', unit: '', type: RowType.INPUT, step: 0.1 },
  { id: 'rpm', label: 'M/C RPM', unit: '', type: RowType.INPUT, step: 1, isInteger: true },
  { id: 'tu1', label: 'TAKE UP 1', unit: '', type: RowType.CALCULATED_INPUT, step: 1 },
  { id: 'tu2', label: 'TAKE UP 2', unit: '', type: RowType.CALCULATED_INPUT, step: 1 },
  { id: 'tu3', label: 'TAKE UP 3', unit: '', type: RowType.CALCULATED_INPUT },
];

export const PRIMARY_COLOR = '#2563EB';
export const LONG_PRESS_DURATION = 1500;