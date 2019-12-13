import {FocusableRefValue, InputBase, StyleProps, TextInputBase, TextInputDOMProps, ValueBase} from '@react-types/shared';
import {ReactNode} from 'react';

export interface TextFieldProps extends InputBase, TextInputBase, ValueBase<string> {}

export interface SpectrumTextFieldProps extends TextFieldProps, TextInputDOMProps, StyleProps {
  icon?: ReactNode,
  isQuiet?: boolean
}

export interface TextFieldRef extends FocusableRefValue<HTMLInputElement & HTMLTextAreaElement, HTMLDivElement> {
  select(): void,
  getInputElement(): HTMLInputElement & HTMLTextAreaElement
}
