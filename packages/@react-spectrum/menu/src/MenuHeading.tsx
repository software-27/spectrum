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

import {classNames} from '@react-spectrum/utils';
import {Heading} from '@react-spectrum/typography';
import React from 'react';
import {SpectrumMenuHeadingProps} from '@react-types/menu';
import styles from '@adobe/spectrum-css-temp/components/menu/vars.css';

export function MenuHeading<T>({item}: SpectrumMenuHeadingProps<T>) {
  return (
    <Heading
      UNSAFE_className={
        classNames(
          styles, 
          'spectrum-Menu-sectionHeading'
        )
      }
      aria-level={3}
      role="heading">
      {item.rendered}
    </Heading>
  );
}
