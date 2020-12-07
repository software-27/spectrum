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
import {DEFAULT_MAX_VALUE, DEFAULT_MIN_VALUE} from '@react-stately/slider';
import {FocusableRef} from '@react-types/shared';
import {FocusRing} from '@react-aria/focus';
import {mergeProps} from '@react-aria/utils';
import React from 'react';
import {SliderBase, SliderBaseChildArguments, SliderBaseProps} from './SliderBase';
import {SpectrumRangeSliderProps} from '@react-types/slider';
import styles from '@adobe/spectrum-css-temp/components/slider/vars.css';
import {useHover} from '@react-aria/interactions';
import {useLocale} from '@react-aria/i18n';
import {VisuallyHidden} from '@react-aria/visually-hidden';

function RangeSlider(props: SpectrumRangeSliderProps, ref: FocusableRef<HTMLDivElement>) {
  let {onChange, value, defaultValue, ...otherProps} = props;

  let baseProps: Omit<SliderBaseProps, 'children'> = {
    ...otherProps,
    count: 2,
    value: value != null ? [value.start, value.end] : undefined,
    defaultValue: defaultValue != null
      ? [defaultValue.start, defaultValue.end]
      // make sure that useSliderState knows we have two handles
      : [props.minValue ?? DEFAULT_MIN_VALUE, props.maxValue ?? DEFAULT_MAX_VALUE],
    onChange(v) {
      onChange?.({start: v[0], end: v[1]});
    }
  };

  let {direction} = useLocale();
  let hovers = [useHover({}), useHover({})];

  return (
    <SliderBase {...baseProps} classes={'spectrum-Slider--range'} ref={ref}>
      {({state, thumbProps, inputRefs, inputProps}: SliderBaseChildArguments) => {
        let cssDirection = direction === 'rtl' ? 'right' : 'left';

        let lowerTrack = (
          <div
            className={classNames(styles, 'spectrum-Slider-track')}
            style={{width: `${state.getThumbPercent(0) * 100}%`}} />
        );
        let middleTrack = (
          <div
            className={classNames(styles, 'spectrum-Slider-track')}
            style={{[cssDirection]: `${state.getThumbPercent(0) * 100}%`, width: `${Math.abs(state.getThumbPercent(0) - state.getThumbPercent(1)) * 100}%`}} />
        );
        let upperTrack = (
          <div
            className={classNames(styles, 'spectrum-Slider-track')}
            style={{[cssDirection]: `${state.getThumbPercent(1) * 100}%`, width: `${(1 - state.getThumbPercent(1)) * 100}%`}} />
        );

        let handles = [0, 1].map(i => (
          <div
            className={classNames(styles, 'spectrum-Slider-handle', {'is-hovered': hovers[i].isHovered, 'is-dragged': state.isThumbDragging(i)})}
            style={{[cssDirection]: `${state.getThumbPercent(i) * 100}%`}}
            {...mergeProps(thumbProps[i], hovers[i].hoverProps)}
            role="presentation">
            <VisuallyHidden>
              <input className={classNames(styles, 'spectrum-Slider-input')} ref={inputRefs[i]} {...inputProps[i]} />
            </VisuallyHidden>
          </div>
        ));

        return (
          <>
            {lowerTrack}
            <FocusRing within focusRingClass={classNames(styles, 'is-focused')}>
              {handles[0]}
            </FocusRing>
            {middleTrack}
            <FocusRing within focusRingClass={classNames(styles, 'is-focused')}>
              {handles[1]}
            </FocusRing>
            {upperTrack}
          </>
        );
      }}

    </SliderBase>);
}


const _RangeSlider = React.forwardRef(RangeSlider);
export {_RangeSlider as RangeSlider};
