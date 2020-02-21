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

import {classNames, filterDOMProps, gridStyleProps, SlotContext, useStyleProps} from '@react-spectrum/utils';
import {GridProps} from '@react-types/layout';
import {HTMLElement} from 'react-dom';
import React, {RefObject} from 'react';


export const Grid = React.forwardRef((props: GridProps, ref: RefObject<HTMLElement>) => {
  let {
    children,
    slots,
    ...otherProps
  } = props;
  let {styleProps} = useStyleProps(otherProps, gridStyleProps);
  styleProps.style.display = 'grid'; // inline-grid?

  return (
    <div {...filterDOMProps(otherProps)} {...styleProps} ref={ref} className={classNames({}, slots && slots.container, styleProps.className)}>
      <SlotContext.Provider value={slots}>
        {children}
      </SlotContext.Provider>
    </div>
  );
});
