import {DOMProps} from '@react-types/shared';
import {ProgressBarProps} from '@react-types/progress';
import {ReactNode} from 'react';
import {StyleProps} from '@react-spectrum/view';

export interface SpectrumProgressCircleProps extends ProgressBarProps, DOMProps, StyleProps {
  size?: 'S' | 'M' | 'L',
  variant?: 'overBackground',
  isCentered?: boolean
}

export interface SpectrumProgressBarProps extends ProgressBarProps, DOMProps, StyleProps {
  size?: 'S' | 'L',
  labelPosition?: 'top' | 'side',
  showValueLabel?: boolean, // true by default if label, false by default if not
  formatOptions?: Intl.NumberFormatOptions, // defaults to formatting as a percentage.
  valueLabel?: ReactNode, // custom value label (e.g. 1 of 4)
  variant?: 'positive' | 'warning' | 'critical' | 'overBackground'
}
