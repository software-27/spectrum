/*
 * Copyright 2024 Adobe. All rights reserved.
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
  Meter as AriaMeter,
  MeterProps as AriaMeterProps,
  ContextValue
} from 'react-aria-components';
import {bar, track} from './bar-utils'  with {type: 'macro'};
import {createContext, forwardRef, ReactNode} from 'react';
import {DOMRef, DOMRefValue} from '@react-types/shared';
import {FieldLabel} from './Field';
import {fieldLabel, getAllowedOverrides, StyleProps} from './style-utils' with {type: 'macro'};
import {size, style} from '../style/spectrum-theme' with {type: 'macro'};
import {useDOMRef} from '@react-spectrum/utils';
import {useSpectrumContextProps} from './useSpectrumContextProps';

interface MeterStyleProps {
  /** The [visual style](https://spectrum.adobe.com/page/meter/#-Options) of the Meter. */
  variant: 'informative' | 'positive' | 'notice' | 'negative',
  /**
   * The size of the Meter.
   *
   * @default 'M'
   */
  size?: 'S' | 'M' | 'L' | 'XL',
  /** The static color style to apply. Useful when the button appears over a color background. */
  staticColor?: 'white' | 'black'
}

export interface MeterProps extends Omit<AriaMeterProps, 'children' | 'className' | 'style'>, MeterStyleProps, StyleProps {
  /** The content to display as the label. */
  label?: ReactNode
}

export const MeterContext = createContext<ContextValue<MeterProps, DOMRefValue<HTMLDivElement>>>(null);

const wrapper = style<MeterStyleProps>({
  ...bar(),
  width: {
    default: 208,
    size: {
      S: 192,
      L: 224,
      XL: 240
    }
  }
}, getAllowedOverrides());

const valueStyles = style({
  ...fieldLabel(),
  gridArea: 'value'
});

const trackStyles = style({
  ...track(),
  height: {
    default: size(6),
    size: {
      S: 4, // progress-bar-thickness-small
      M: size(6), // progress-bar-thickness-medium
      L: 8, // progress-bar-thickness-large
      XL: size(10) // progress-bar-thickness-extra-large
    }
  }
});

const fillStyles = style<MeterStyleProps>({
  height: 'full',
  borderStyle: 'none',
  borderRadius: 'full',
  backgroundColor: {
    default: 'informative',
    variant: {
      positive: 'positive',
      notice: 'notice',
      negative: 'negative'
    },
    staticColor: {
      white: {
        default: 'transparent-white-900'
      },
      // TODO: Is there a black static color in S2?
      black: {
        default: 'transparent-black-900'
      }
    },
    forcedColors: 'ButtonText'
  }
});

function Meter(props: MeterProps, ref: DOMRef<HTMLDivElement>) {
  [props, ref] = useSpectrumContextProps(props, ref, MeterContext);
  let domRef = useDOMRef(ref);

  let {
    label,
    size = 'M',
    staticColor,
    styles,
    UNSAFE_className = '',
    UNSAFE_style,
    variant,
    ...groupProps
  } = props;

  return (
    <AriaMeter
      {...groupProps}
      ref={domRef}
      style={UNSAFE_style}
      className={UNSAFE_className + wrapper({
        size,
        variant,
        staticColor
      }, styles)}>
      {({percentage, valueText}) => (
        <>
          {label && <FieldLabel size={size} labelAlign="start" labelPosition="top" staticColor={staticColor}>{label}</FieldLabel>}
          {label && <span className={valueStyles({size, labelAlign: 'end', staticColor})}>{valueText}</span>}
          <div className={trackStyles({staticColor, size})}>
            <div className={fillStyles({staticColor, variant})} style={{width: percentage + '%'}} />
          </div>
        </>
      )}
    </AriaMeter>
  );
}

/**
 * Meters are visual representations of a quantity or an achievement.
 * Their progress is determined by user actions, rather than system actions.
 */
let _Meter = forwardRef(Meter);
export {_Meter as Meter};
