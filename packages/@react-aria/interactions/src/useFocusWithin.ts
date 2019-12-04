import {createEventHandler} from './createEventHandler';
import {FocusEvent} from '@react-types/shared';
import {HTMLAttributes, useRef} from 'react';

interface FocusWithinProps {
  isDisabled?: boolean,
  onFocusWithin?: (e: FocusEvent) => void,
  onBlurWithin?: (e: FocusEvent) => void,
  onFocusWithinChange?: (isFocusWithin: boolean) => void
}

interface FocusWithinResult {
  focusWithinProps: HTMLAttributes<HTMLElement>
}

/**
 * Handles focus events for the target and all children
 */
export function useFocusWithin(props: FocusWithinProps): FocusWithinResult {
  let state = useRef({
    isFocusWithin: false
  }).current;

  if (props.isDisabled) {
    return {focusWithinProps: {}};
  }

  let onFocus, onBlur;
  if (props.onFocusWithin || props.onFocusWithinChange) {
    onFocus = createEventHandler((e: FocusEvent) => {
      if (props.onFocusWithin) {
        props.onFocusWithin(e);
      }

      if (!state.isFocusWithin) {
        if (props.onFocusWithinChange) {
          props.onFocusWithinChange(true);
        }

        state.isFocusWithin = true;
      }
    });
  }

  if (props.onBlurWithin || props.onFocusWithinChange) {
    onBlur = createEventHandler((e: FocusEvent) => {
      // We don't want to trigger onBlurWithin and then immediately onFocusWithin again 
      // when moving focus inside the element. Only trigger if the currentTarget doesn't 
      // include the relatedTarget (where focus is moving).
      if (state.isFocusWithin && !e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
        if (props.onBlurWithin) {
          props.onBlurWithin(e);
        }

        if (props.onFocusWithinChange) {
          props.onFocusWithinChange(false);
        }

        state.isFocusWithin = false;
      }
    });
  }
  
  return {
    focusWithinProps: {
      onFocus: onFocus,
      onBlur: onBlur
    }
  };
}
