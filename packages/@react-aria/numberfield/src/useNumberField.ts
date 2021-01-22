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

import {AriaButtonProps} from '@react-types/button';
import {AriaNumberFieldProps} from '@react-types/numberfield';
import {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {mergeProps, useId} from '@react-aria/utils';
import {NumberFieldState} from '@react-stately/numberfield';
import {SpinButtonProps, useSpinButton} from '@react-aria/spinbutton';
import {useFocus} from '@react-aria/interactions';
import {
  useLocale,
  useMessageFormatter,
  useNumberFormatter
} from '@react-aria/i18n';
import {useTextField} from '@react-aria/textfield';

interface NumberFieldProps extends AriaNumberFieldProps, SpinButtonProps {
  inputRef?:  RefObject<HTMLInputElement>,
  decrementAriaLabel?: string,
  incrementAriaLabel?: string,
  incrementRef?: RefObject<HTMLDivElement>,
  decrementRef?: RefObject<HTMLDivElement>
}

interface NumberFieldAria {
  labelProps: LabelHTMLAttributes<HTMLLabelElement>,
  inputFieldProps: InputHTMLAttributes<HTMLInputElement>,
  numberFieldProps: HTMLAttributes<HTMLDivElement>,
  incrementButtonProps: AriaButtonProps,
  decrementButtonProps: AriaButtonProps
}

function supportsNativeBeforeInputEvent() {
  return typeof window !== 'undefined' &&
    window.InputEvent &&
    // @ts-ignore
    typeof InputEvent.prototype.getTargetRanges === 'function';
}

export function useNumberField(props: NumberFieldProps, state: NumberFieldState): NumberFieldAria {
  let {
    decrementAriaLabel,
    incrementAriaLabel,
    isDisabled,
    isReadOnly,
    isRequired,
    minValue,
    maxValue,
    autoFocus,
    validationState,
    label,
    formatOptions,
    incrementRef,
    decrementRef,
    inputRef
  } = props;

  let {
    increment,
    incrementToMax,
    decrement,
    decrementToMin,
    numberValue,
    commitInputValue
  } = state;

  const formatMessage = useMessageFormatter(intlMessages);
  let {direction} = useLocale();

  const inputId = useId();

  let isFocused = useRef(false);
  let {focusProps} = useFocus({
    onBlur: (e) => {
      let incrementButton = incrementRef.current;
      let decrementButton = decrementRef.current;
      if ((incrementButton && decrementButton) && (e.relatedTarget === incrementButton || e.relatedTarget === decrementButton)) {
        return;
      }
      // Set input value to normalized valid value
      commitInputValue();
    },
    onFocusChange: value => isFocused.current = value
  });

  const {
    spinButtonProps,
    incrementButtonProps: incButtonProps,
    decrementButtonProps: decButtonProps
  } = useSpinButton(
    {
      isDisabled,
      isReadOnly,
      isRequired,
      // Use min/maxValue prop instead of stately.
      maxValue,
      minValue,
      onIncrement: increment,
      onIncrementToMax: incrementToMax,
      onDecrement: decrement,
      onDecrementToMin: decrementToMin,
      value: numberValue
    }
  );

  incrementAriaLabel = incrementAriaLabel || formatMessage('Increment');
  decrementAriaLabel = decrementAriaLabel || formatMessage('Decrement');
  const cannotStep = isDisabled || isReadOnly;

  const incrementButtonProps: AriaButtonProps = mergeProps(incButtonProps, {
    'aria-label': incrementAriaLabel,
    'aria-controls': inputId,
    excludeFromTabOrder: true,
    // use state min/maxValue because otherwise in default story, steppers will never disable
    isDisabled: cannotStep || numberValue >= state.maxValue
  });
  const decrementButtonProps: AriaButtonProps = mergeProps(decButtonProps, {
    'aria-label': decrementAriaLabel,
    'aria-controls': inputId,
    excludeFromTabOrder: true,
    isDisabled: cannotStep || numberValue <= state.minValue
  });

  let onWheel = useCallback((e) => {
    // If the input isn't supposed to receive input, do nothing.
    // If the ctrlKey is pressed, this is a zoom event, do nothing.
    if (isDisabled || isReadOnly || e.ctrlKey) {
      return;
    }

    // stop scrolling the page
    e.preventDefault();

    let isRTL = direction === 'rtl';
    if (e.deltaY > 0 || (isRTL ? e.deltaX < 0 : e.deltaX > 0)) {
      increment();
    } else {
      decrement();
    }
  }, [isReadOnly, isDisabled, decrement, increment, direction]);

  /**
   * This block determines the inputMode, if hasDecimal then 'decimal', otherwise 'numeric'.
   * This will affect the software keyboard that is shown. 'decimal' has a decimal character on the keyboard
   * and 'numeric' does not.
   */
  let numberFormatter = useNumberFormatter(formatOptions);
  let intlOptions = useMemo(() => numberFormatter.resolvedOptions(), [numberFormatter]);
  let hasDecimals = intlOptions.maximumFractionDigits > 0;
  let inputMode: 'decimal' | 'numeric' | 'text' = hasDecimals ? 'decimal' : 'numeric';
  if (state.minValue < 0) { // iOS - neither allows negative signs, so use full keyboard
    inputMode = 'text';
  }

  let stateRef = useRef(state);
  stateRef.current = state;

  // All browsers implement the 'beforeinput' event natively except Firefox
  // (currently behind a flag as of Firefox 84). React's polyfill does not
  // run in all cases that the native event fires, e.g. when deleting text.
  // Use the native event if available so that we can prevent invalid deletions.
  // We do not attempt to polyfill this in Firefox since it would be very complicated,
  // the benefit of doing so is fairly minor, and it's going to be natively supported soon.
  useEffect(() => {
    if (!supportsNativeBeforeInputEvent()) {
      return;
    }

    let input = inputRef.current;

    let onBeforeInput = (e: InputEvent) => {
      let state = stateRef.current;

      // Compute the next value of the input if the event is allowed to proceed.
      // See https://www.w3.org/TR/input-events-2/#interface-InputEvent-Attributes for a full list of input types.
      let nextValue: string;
      switch (e.inputType) {
        case 'historyUndo':
        case 'historyRedo':
          // Explicitly allow undo/redo. e.data is null in this case, but there's no need to validate,
          // because presumably the input would have already been validated previously.
          return;
        case 'deleteContent':
        case 'deleteByCut':
        case 'deleteByDrag':
          nextValue = input.value.slice(0, input.selectionStart) + input.value.slice(input.selectionEnd);
          break;
        case 'deleteContentForward':
          // This is potentially incorrect, since the browser may actually delete more than a single UTF-16
          // character. In reality, a full Unicode grapheme cluster consisting of multiple UTF-16 characters
          // or code points may be deleted. However, in our currently supported locales, there are no such cases.
          // If we support additional locales in the future, this may need to change.
          nextValue = input.selectionEnd === input.selectionStart
            ? input.value.slice(0, input.selectionStart + 1) + input.value.slice(input.selectionStart)
            : input.value.slice(0, input.selectionStart) + input.value.slice(input.selectionEnd);
          break;
        case 'deleteContentBackward':
          nextValue = input.selectionEnd === input.selectionStart
            ? input.value.slice(0, input.selectionStart - 1) + input.value.slice(input.selectionStart)
            : input.value.slice(0, input.selectionStart) + input.value.slice(input.selectionEnd);
          break;
        default:
          if (e.data != null) {
            nextValue =
              input.value.slice(0, input.selectionStart) +
              e.data +
              input.value.slice(input.selectionEnd);
          }
          break;
      }

      // If we did not compute a value, or the new value is invalid, prevent the event
      // so that the browser does not update the input text, move the selection, or add to
      // the undo/redo stack.
      if (nextValue == null || !state.validate(nextValue)) {
        e.preventDefault();
      }
    };

    input.addEventListener('beforeinput', onBeforeInput, false);
    return () => {
      input.removeEventListener('beforeinput', onBeforeInput, false);
    };
  }, [inputRef, stateRef]);

  let onBeforeInput = !supportsNativeBeforeInputEvent()
    ? e => {
      let nextValue =
        e.target.value.slice(0, e.target.selectionStart) +
        e.data +
        e.target.value.slice(e.target.selectionEnd);

      if (!state.validate(nextValue)) {
        e.preventDefault();
      }
    }
    : null;

  let onChange = value => {
    state.setInputValue(value);
  };

  let {labelProps, inputProps} = useTextField(
    {
      label,
      autoFocus,
      isDisabled,
      isReadOnly,
      isRequired,
      validationState,
      value: state.inputValue,
      autoComplete: 'off',
      'aria-label': props['aria-label'] || null,
      'aria-labelledby': props['aria-labelledby'] || null,
      id: inputId,
      placeholder: formatMessage('Enter a number'),
      type: 'text', // Can't use type="number" because then we can't have things like $ in the field.
      inputMode,
      onChange,
      onBeforeInput
    }, inputRef);

  const inputFieldProps = mergeProps(
    spinButtonProps,
    inputProps,
    focusProps,
    {
      onWheel,
      // override the spinbutton role, we can't focus a spin button with VO
      role: null,
      'aria-roledescription': formatMessage('Spin button number field'),
      'aria-valuemax': null,
      'aria-valuemin': null,
      'aria-valuenow': null,
      'aria-valuetext': null
    }
  );
  return {
    numberFieldProps: {
      role: 'group',
      'aria-disabled': isDisabled,
      'aria-invalid': validationState === 'invalid' ? 'true' : undefined
    },
    labelProps,
    inputFieldProps,
    incrementButtonProps,
    decrementButtonProps
  };
}
