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

import {AriaLabelingProps, DOMProps, DOMRef} from '@react-types/shared';
import {CenterBaseline} from './CenterBaseline';
import {filterDOMProps} from '@react-aria/utils';
import {forwardRef, ReactNode} from 'react';
import {getAllowedOverrides, StyleProps} from './style-utils' with {type: 'macro'};
import {size, style} from '../style/spectrum-theme' with {type: 'macro'};
import {useDOMRef} from '@react-spectrum/utils';

interface StatusLightStyleProps {
  /**
   * The variant changes the color of the status light.
   * When status lights have a semantic meaning, they should use the variant for semantic colors.
   */
  variant: 'informative' | 'neutral' | 'positive' | 'notice' | 'negative' | 'celery' | 'chartreuse' | 'cyan' | 'fuchsia' | 'purple' | 'magenta' | 'indigo' | 'seafoam' | 'yellow' | 'pink' | 'turquoise' | 'cinnamon' | 'brown' | 'silver',
  /**
   * The size of the StatusLight.
   *
   * @default 'M'
   */
  size?: 'S' | 'M' | 'L' | 'XL'
}

export interface StatusLightProps extends StatusLightStyleProps, DOMProps, AriaLabelingProps, StyleProps {
  /**
   * The content to display as the label.
   */
  children?: ReactNode,
  /**
   * An accessibility role for the status light. Should be set when the status
   * can change at runtime, and no more than one status light will update simultaneously.
   * For cases where multiple statuses can change at the same time, use a Toast instead.
   */
  role?: 'status'
}

const wrapper = style<StatusLightStyleProps>({
  display: 'flex',
  gap: 'text-to-visual',
  alignItems: 'baseline',
  width: 'fit',
  font: 'control',
  color: {
    default: 'neutral',
    variant: {
      neutral: 'gray-600'
    }
  },
  disableTapHighlight: true
}, getAllowedOverrides());

const light = style<StatusLightStyleProps>({
  size: {
    size: {
      S: 8,
      M: size(10),
      L: 12,
      XL: size(14)
    }
  },
  fill: {
    variant: {
      informative: 'informative',
      neutral: 'neutral',
      positive: 'positive',
      notice: 'notice',
      negative: 'negative',
      celery: 'celery',
      chartreuse: 'chartreuse',
      cyan: 'cyan',
      fuchsia: 'fuchsia',
      purple: 'purple',
      magenta: 'magenta',
      indigo: 'indigo',
      seafoam: 'seafoam',
      yellow: 'yellow',
      pink: 'pink',
      turquoise: 'turquoise',
      cinnamon: 'cinnamon',
      brown: 'brown',
      silver: 'silver'
    }
  }
});

function StatusLight(props: StatusLightProps, ref: DOMRef<HTMLDivElement>) {
  let {children, size = 'M', variant, role, UNSAFE_className = '', UNSAFE_style, styles} = props;
  let domRef = useDOMRef(ref);

  if (!children && !props['aria-label']) {
    console.warn('If no children are provided, an aria-label must be specified');
  }

  if (!role && (props['aria-label'] || props['aria-labelledby'])) {
    console.warn('A labelled StatusLight must have a role.');
  }

  return (
    <div
      {...filterDOMProps(props, {labelable: !!role})}
      ref={domRef}
      role={role}
      style={UNSAFE_style}
      className={UNSAFE_className + wrapper({size, variant}, styles)}>
      <CenterBaseline>
        <svg className={light({size, variant})} aria-hidden="true">
          <circle r="50%" cx="50%" cy="50%" />
        </svg>
      </CenterBaseline>
      {children}
    </div>
  );
}

/**
 * Status lights are used to color code categories and labels commonly found in data visualization.
 * When status lights have a semantic meaning, they should use semantic variant colors.
 */
let _StatusLight = /*#__PURE__*/ forwardRef(StatusLight);
export {_StatusLight as StatusLight};
