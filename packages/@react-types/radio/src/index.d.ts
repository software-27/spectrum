/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  AriaLabelingProps,
  AriaValidationProps,
  DOMProps,
  FocusableProps,
  InputBase,
  LabelableProps,
  Orientation,
  SpectrumLabelableProps,
  StyleProps,
  Validation,
  ValueBase
} from '@react-types/shared';
import {ReactElement, ReactNode} from 'react';

export interface RadioGroupProps extends ValueBase<string>, InputBase, Validation, LabelableProps {
  /**
   * The Radio(s) contained within the RadioGroup.
   */
  children: ReactElement<RadioProps> | ReactElement<RadioProps>[],
  /**
   * The axis the Radio Button(s) should align with.
   * @default 'vertical'
   */
  orientation?: Orientation,
  /**
   * The unique identifying name of the RadioGroup that is applied to the Radios within the group.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name_and_radio_buttons).
   */
  name?: string
}

export interface RadioProps extends FocusableProps {
  /**
   * The value of the radio button, used to identify it in a RadioGroup.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string,
  /**
   * The label for the Radio. Accepts any renderable node.
   */
  children?: ReactNode,
  /**
   * Whether the radio button is disabled or not.
   * Shows that a selection exists, but is not available in that circumstance.
   */
  isDisabled?: boolean
}

export interface AriaRadioGroupProps extends RadioGroupProps, DOMProps, AriaLabelingProps, AriaValidationProps {}
export interface SpectrumRadioGroupProps extends AriaRadioGroupProps, SpectrumLabelableProps, StyleProps {
  /**
   * By default, radio buttons are not emphasized (gray).
   * The emphasized (blue) version provides visual prominence.
   */
  isEmphasized?: boolean
}

export interface AriaRadioProps extends RadioProps, DOMProps, AriaLabelingProps {}
export interface SpectrumRadioProps extends AriaRadioProps, StyleProps {}
