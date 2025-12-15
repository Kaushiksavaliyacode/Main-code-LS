import { MaterialParams, RowConfig, RowType } from './types';

export const DEFAULT_CURRENT: MaterialParams = {
  sizer: 750,
  micron: 51,
  rpm: 900,
  ls3: 1080,
  weight: 0,
};

export const ROW_CONFIGS: RowConfig[] = [
  { id: 'sizer', label: 'Sizer', unit: '', type: RowType.INPUT, step: 0.1 },
  { id: 'micron', label: 'Micron', unit: '', type: RowType.INPUT, step: 0.1 },
  { id: 'rpm', label: 'RPM', unit: '', type: RowType.INPUT, step: 1, isInteger: true },
  { id: 'ls3', label: 'LS 3', unit: '', type: RowType.CALCULATED_INPUT },
  { id: 'weight', label: '1 MTR Weight', unit: 'kg', type: RowType.CALCULATED_INPUT },
];

export const PRIMARY_COLOR = '#2563EB';
export const LONG_PRESS_DURATION = 1500; // Reduced from 5000ms for better UX