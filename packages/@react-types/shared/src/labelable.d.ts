import {ReactNode} from 'react';

export type LabelPosition = 'top' | 'side';
export type Alignment = 'start' | 'end';
export type NecessityIndicator = 'icon' | 'label';

export interface LabelableProps {
  /** The content to display as the label. */
  label?: ReactNode,
  /** Whether the label is labeling a required field or group. */
  isRequired?: boolean
}

export interface SpectrumLabelableProps extends LabelableProps {
  /** 
   * The label's overall position relative to the element it is labeling.
   * @default "top" 
   */
  labelPosition?: LabelPosition,
  /** 
   * The label's horizontal alignment relative to the element it is labeling.
   * @default "start" 
   */
  labelAlign?: Alignment,
  /** 
   * Whether the required state should be shown as an icon or text.
   * @default "icon" 
   */
  necessityIndicator?: NecessityIndicator
}
