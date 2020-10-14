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
import {ColorSliderProps} from '@react-types/color';
import {ColorThumb} from './ColorThumb';
import {Flex} from '@react-spectrum/layout';
import {Label} from '@react-spectrum/label';
import React, {useRef, useState} from 'react';
import styles from '@adobe/spectrum-css-temp/components/colorslider/vars.css';
import {useColorSlider} from '@react-aria/color';
import {useColorSliderState} from '@react-stately/color';
import {useFocus, useFocusVisible} from '@react-aria/interactions';
import {useLocale} from '@react-aria/i18n';
import {useProviderProps} from '@react-spectrum/provider';

function ColorSlider(props: ColorSliderProps) {
  props = useProviderProps(props);

  let {isDisabled, channel, orientation, showValueLabel = true} = props;
  let vertical = orientation === 'vertical';

  let {direction} = useLocale();

  let inputRef = useRef();
  let trackRef = useRef();

  // The default label should be localized...
  let defaultLabel = channel[0].toUpperCase() + channel.slice(1);

  let labelText = props.label;
  if (props.label === undefined) {
    if (!vertical) {
      labelText = defaultLabel;
    }
  }
  let ariaLabel = props['aria-label'] ?? (labelText == null ? defaultLabel : undefined);

  let state = useColorSliderState(props);
  let {inputProps, thumbProps, containerProps, trackProps, labelProps, generateBackground} = useColorSlider({
    ...props,
    label: labelText,
    'aria-label': ariaLabel,
    trackRef,
    inputRef
  }, state);

  let {isFocusVisible} = useFocusVisible();
  let [isFocused, setIsFocused] = useState(false);
  let {focusProps} = useFocus({
    isDisabled,
    onFocusChange: setIsFocused
  });

  let thumbPosition = state.getThumbPercent(0);
  if (vertical || direction === 'rtl') {
    thumbPosition = 1 - thumbPosition;
  }

  let alignLabel;
  if (vertical) {
    alignLabel = 'center';
  } else if (labelText != null && showValueLabel) {
    alignLabel = 'space-between';
  } else if (labelText != null) {
    alignLabel = 'flex-start';
  } else if (showValueLabel) {
    alignLabel = 'flex-end';
  }

  return (
    <div>
      <Flex direction="row" justifyContent={alignLabel}>
        {labelText && <Label {...labelProps}>{labelText}</Label>}
        {/* TODO: is it on purpose that aria-labelledby isn't passed through? */}
        {showValueLabel && <Label aria-labelledby={labelProps.id}>{state.getThumbValueLabel(0)}</Label>}
      </Flex>
      <div className={classNames(styles, 'spectrum-ColorSlider', {'is-disabled': isDisabled, 'spectrum-ColorSlider--vertical': vertical})} {...containerProps}>
        <div className={classNames(styles, 'spectrum-ColorSlider-checkerboard')} role="presentation" ref={trackRef} {...trackProps}>
          <div className={classNames(styles, 'spectrum-ColorSlider-gradient')} role="presentation" style={{background: generateBackground()}} />
        </div>

        <ColorThumb
          value={state.getDisplayColor()}
          isFocused={isFocused && isFocusVisible}
          isDisabled={isDisabled}
          isDragging={state.isThumbDragging(0)}
          style={{[vertical ? 'top' : 'left']: `${thumbPosition * 100}%`}}
          className={classNames(styles, 'spectrum-ColorSlider-handle')}
          {...thumbProps}>
          <input {...inputProps} {...focusProps} ref={inputRef} className={classNames(styles, 'spectrum-ColorSlider-slider')} />
        </ColorThumb>
      </div>
    </div>);
}

export {ColorSlider};
