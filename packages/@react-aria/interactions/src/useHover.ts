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

import {HoverEvents} from '@react-types/shared';
import {HTMLAttributes, useMemo} from 'react';

export interface HoverProps extends HoverEvents {
  /** Whether the hover events should be disabled. */
  isDisabled?: boolean
}

interface HoverResult {
  /** Props to spread on the target element. */
  hoverProps: HTMLAttributes<HTMLElement>
}

/**
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 */
export function useHover(props: HoverProps): HoverResult {
  let {
    onHover,
    onHoverChange,
    onHoverEnd,
    isDisabled
  } = props;

  let hoverProps = useMemo(() => {

    let triggerHoverStart = (event, pointerType) => {
      if (isDisabled) {
        return;
      }

      if (pointerType === 'touch') {
        return;
      }

      let target = event.target;

      if (onHover) {
        onHover({
          type: 'hover',
          target,
          pointerType
        });
      }

      if (onHoverChange) {
        onHoverChange(true);
      }
    };


    let triggerHoverEnd = (event, pointerType) => {
      if (isDisabled) {
        return;
      }

      if (pointerType === 'touch') {
        return;
      }

      let target = event.target;

      if (onHoverEnd) {
        onHoverEnd({
          type: 'hoverend',
          target,
          pointerType
        });
      }

      if (onHoverChange) {
        onHoverChange(false);
      }
    };

    let hoverProps: HTMLAttributes<HTMLElement> = {};

    if (typeof PointerEvent !== 'undefined') {
      hoverProps.onPointerEnter = (e) => {
        triggerHoverStart(e, e.pointerType);
      };

      hoverProps.onPointerLeave = (e) => {
        triggerHoverEnd(e, e.pointerType);
      };

    } else {
      hoverProps.onMouseEnter = (e) => {
        triggerHoverStart(e, 'mouse');
      };

      hoverProps.onMouseLeave = (e) => {
        triggerHoverEnd(e, 'mouse');
      };
    }
    return hoverProps;
  }, [onHover, onHoverChange, onHoverEnd, isDisabled]);

  return {
    hoverProps
  };
}
