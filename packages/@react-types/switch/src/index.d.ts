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

import {CheckboxBase} from '@react-types/checkbox';
import {DOMProps, StyleProps} from '@react-types/shared';

export type SwitchProps = CheckboxBase;
export interface SpectrumSwitchProps extends SwitchProps, DOMProps, StyleProps {
  /**
   * By default, switches are not emphasized (gray).
   * This prop sets the emphasized style (blue) which provides visual prominence.
   * @default "false"
   */
  isEmphasized?: boolean
}
