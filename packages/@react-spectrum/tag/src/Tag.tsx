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

import {classNames, ClearSlots, SlotProvider, useStyleProps} from '@react-spectrum/utils';
import {ClearButton} from '@react-spectrum/button';
import {mergeProps} from '@react-aria/utils';
import React, {useRef} from 'react';
import styles from '@adobe/spectrum-css-temp/components/tags/vars.css';
import type {TagGroupState} from '@react-stately/tag';
import {TagProps} from '@react-types/tag';
import {Text} from '@react-spectrum/text';
import {useFocusRing} from '@react-aria/focus';
import {useHover} from '@react-aria/interactions';
import {useTag} from '@react-aria/tag';

export interface SpectrumTagProps<T> extends TagProps<T> {
  state: TagGroupState<T>
}

export function Tag<T>(props: SpectrumTagProps<T>) {
  const {
    children,
    allowsRemoving,
    item,
    state,
    onRemove,
    ...otherProps
  } = props;

  // @ts-ignore
  let {styleProps} = useStyleProps(otherProps);
  let {hoverProps, isHovered} = useHover({});
  let {isFocused, isFocusVisible, focusProps} = useFocusRing({within: true});
  let tagRowRef = useRef();
  let {clearButtonProps, labelProps, tagProps, tagRowProps} = useTag({
    ...props,
    isFocused,
    allowsRemoving,
    item,
    onRemove,
    tagRowRef
  }, state);

  return (
    <div
      {...mergeProps(tagRowProps, hoverProps, focusProps)}
      className={classNames(
          styles,
          'spectrum-Tags-item',
        {
          'focus-ring': isFocusVisible,
          'is-focused': isFocused,
          'is-hovered': isHovered,
          'is-removable': allowsRemoving
        },
          styleProps.className
        )}
      ref={tagRowRef}>
      <div
        className={classNames(styles, 'spectrum-Tag-cell')}
        {...tagProps}>
        <SlotProvider
          slots={{
            icon: {UNSAFE_className: classNames(styles, 'spectrum-Tag-icon'), size: 'XS'},
            text: {UNSAFE_className: classNames(styles, 'spectrum-Tag-content'), ...labelProps}
          }}>
          {typeof children === 'string' ? <Text>{children}</Text> : children}
          <ClearSlots>
            {allowsRemoving && <TagRemoveButton item={item} {...clearButtonProps} UNSAFE_className={classNames(styles, 'spectrum-Tag-action')} />}
          </ClearSlots>
        </SlotProvider>
      </div>
    </div>
  );
}

function TagRemoveButton(props) {
  let {styleProps} = useStyleProps(props);

  return (
    <span
      {...styleProps}>
      <ClearButton
        preventFocus
        {...props} />
    </span>
  );
}
