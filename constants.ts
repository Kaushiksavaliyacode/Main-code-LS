import { MaterialParams, RowConfig, RowType } from './types';

export const DEFAULT_CURRENT: MaterialParams = {
  sizer: 710,
  micron: 35,
  rpm: 800,
  ls3: 1080,
  weight: 0,
};

export const ROW_CONFIGS: RowConfig[] = [
  { id: 'sizer', label: 'Sizer', unit: 'mm', type: RowType.INPUT, step: 0.1 },
  { id: 'micron', label: 'Micron', unit: 'µm', type: RowType.INPUT, step: 0.1 },
  { id: 'rpm', label: 'RPM', unit: 'rpm', type: RowType.INPUT, step: 1, isInteger: true },
  { id: 'ls3', label: 'LS 3', unit: '', type: RowType.CALCULATED_INPUT },
  { id: 'weight', label: '1 MTR Weight', unit: 'kg', type: RowType.CALCULATED_INPUT },
];

export const PRIMARY_COLOR = '#2563EB';
export const LONG_PRESS_DURATION = 1500; // Reduced from 5000ms for better UX