import {DOMProps, SpectrumLabelableProps, StyleProps} from '@react-types/shared';
import {ReactElement} from 'react';
import {SpectrumLabelProps} from '@react-types/label';

export type SpectrumFormItemProps = SpectrumLabelProps;
export interface SpectrumFormProps extends DOMProps, StyleProps, SpectrumLabelableProps {
  children: ReactElement<SpectrumFormItemProps> | ReactElement<SpectrumFormItemProps>[],
}
