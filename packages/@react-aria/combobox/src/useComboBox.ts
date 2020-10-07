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
import {chain, mergeProps, useLabels} from '@react-aria/utils';
import {ComboBoxProps} from '@react-types/combobox';
import {ComboBoxState} from '@react-stately/combobox';
import {getItemId, listIds} from '@react-aria/listbox';
import {HTMLAttributes, InputHTMLAttributes, RefObject, useEffect, useRef} from 'react';
import {ListLayout} from '@react-stately/layout';
import {useMenuTrigger} from '@react-aria/menu';
import {usePress} from '@react-aria/interactions';
import {useSelectableCollection} from '@react-aria/selection';
import {useTextField} from '@react-aria/textfield';

export interface AriaComboBoxProps<T> extends ComboBoxProps<T> {
  popoverRef: RefObject<HTMLDivElement>,
  triggerRef: RefObject<HTMLElement>,
  inputRef: RefObject<HTMLInputElement & HTMLTextAreaElement>,
  layout: ListLayout<T>,
  isMobile?: boolean,
  menuId?: string
}

interface ComboBoxAria {
  triggerProps: AriaButtonProps,
  inputProps: InputHTMLAttributes<HTMLInputElement>,
  listBoxProps: HTMLAttributes<HTMLElement>,
  labelProps: HTMLAttributes<HTMLElement>
}

export function useComboBox<T>(props: AriaComboBoxProps<T>, state: ComboBoxState<T>): ComboBoxAria {
  let {
    triggerRef,
    popoverRef,
    inputRef,
    layout,
    completionMode = 'suggest',
    menuTrigger = 'input',
    allowsCustomValue,
    onCustomValue,
    isReadOnly,
    isDisabled,
    isMobile,
    shouldSelectOnBlur = true,
    menuId
  } = props;

  let {menuTriggerProps, menuProps} = useMenuTrigger(
    {
      type: 'listbox'
    },
    state,
    triggerRef
  );

  let onChange = (val) => {
    state.setInputValue(val);
    state.selectionManager.setFocusedKey(null);

    if (menuTrigger !== 'manual') {
      state.open();
    }
  };

  // TODO: perhaps I should alter useMenuTrigger/useOverlayTrigger to accept a user specified menuId
  // Had to set the list id here instead of in useListBox or ListBoxBase so that it would be properly defined
  // when getting focusedKeyId
  listIds.set(state, menuId || menuProps.id);

  let focusedItem = state.selectionManager.focusedKey && state.isOpen ? state.collection.getItem(state.selectionManager.focusedKey) : undefined;
  let focusedKeyId = focusedItem ? getItemId(state, focusedItem.key) : undefined;

  // Using layout initiated from ComboBox, generate the keydown handlers for textfield (arrow up/down to navigate through menu when focus in the textfield)
  let {collectionProps} = useSelectableCollection({
    selectionManager: state.selectionManager,
    keyboardDelegate: layout,
    disallowTypeAhead: true,
    disallowEmptySelection: true,
    disallowSelectAll: true,
    ref: inputRef
  });

  // For textfield specific keydown operations
  let onKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        if (focusedItem) {
          state.setSelectedKey(state.selectionManager.focusedKey);
          // I think I need this .close so that the menu closes even
          // when the user hits Enter on the already selectedKey
          state.close();
        } else if (allowsCustomValue) {
          // Only fire onCustomValue when hitting enter if it differs from the currently selected key's text (if any)
          let currentKeyText = state.collection.getItem(state.selectedKey)?.textValue;
          if (currentKeyText !== state.inputValue) {
            onCustomValue(state.inputValue);
          }

          state.close();
        }

        break;
      case 'Escape':
        if (state.isOpen) {
          state.close();
        }
        break;
      case 'ArrowDown':
        state.open('first');
        break;
      case 'ArrowUp':
        state.open('last');
        break;
      case 'ArrowLeft':
        state.selectionManager.setFocusedKey(null);
        break;
      case 'ArrowRight':
        state.selectionManager.setFocusedKey(null);
        break;
    }
  };

  let onBlur = (e) => {
    // Early return in the following cases so we don't change textfield focus state, update the selected key erroneously,
    // and trigger close menu twice:
    // If focus is moved into the popover (e.g. when focus is moved to the Tray's input field, mobile case).
    // If the tray input is blurred and the relatedTarget is null (e.g. switching browser tabs or tapping on the tray empty space)
    // The second case results in a inaccurate isFocused state if tray input is blurred by closing the virtual keyboard but we want isFocused to be true so
    // useComboBoxState isOpen calculation doesn't think it should close
    if ((popoverRef?.current && popoverRef.current.contains(e.relatedTarget)) || (isMobile && state.isOpen && e.relatedTarget === null)) {
      return;
    }

    if (!isMobile) {
      state.close();
    }

    if (props.onBlur) {
      props.onBlur(e);
    }

    state.setFocused(false);

    if (focusedItem && shouldSelectOnBlur) {
      state.setSelectedKey(state.selectionManager.focusedKey);
    } else if (allowsCustomValue && !state.selectedKey && onCustomValue) {
      onCustomValue(state.inputValue);
    } else if (!allowsCustomValue) {
      // Clear the input field in the case of menuTrigger = manual and the user has typed
      // in a value that doesn't match any of the list items
      let item = state.collection.getItem(state.selectedKey);
      let itemText = item ? item.textValue : '';
      state.setInputValue(itemText);
    }
  };

  let onFocus = (e) => {
    // If inputfield is already focused, early return to prevent extra props.onFocus calls
    if (state.isFocused) {
      // Call state.setFocused still so the setFocused(false) call generated by the tray's input onBlur from tray closure is overwritten
      state.setFocused(true);
      return;
    }

    // Prevent mobile combobox from opening on focus (focus returns to input when tray is closed and would cause it to reopen)
    if (menuTrigger === 'focus' && !isMobile) {
      state.open();
    }

    if (props.onFocus) {
      props.onFocus(e);
    }

    state.setFocused(true);
  };

  let {labelProps, inputProps} = useTextField({
    ...props,
    onChange,
    onKeyDown: !isReadOnly && chain(state.isOpen && collectionProps.onKeyDownCapture, onKeyDown),
    onBlur,
    value: state.inputValue,
    onFocus,
    autoComplete: 'off'
  }, inputRef);

  let {pressProps: inputPressProps} = usePress({
    onPress: (e) => {
      if ((e.pointerType === 'touch' || e.pointerType === 'virtual') && !isReadOnly) {
        inputRef.current.focus();
        state.open();
      }
    },
    // Prevent focus on press so that press + hold on iPhone still opens the tray instead of requiring another set of taps
    preventFocusOnPress: true,
    isDisabled,
    ref: inputRef
  });

  // Don't need to handle the state.close() when pressing the trigger button since useInteractOutside will call it for us
  let onPress = (e) => {
    if (e.pointerType === 'touch') {
      // Focus the input field in case it isn't focused yet
      inputRef.current.focus();
      if (!state.isOpen) {
        state.open();
      }
    }
  };

  let onPressStart = (e) => {
    if (e.pointerType !== 'touch') {
      inputRef.current.focus();
      if (!state.isOpen) {
        state.open((e.pointerType === 'keyboard' || e.pointerType === 'virtual') && !isMobile ? 'first' : null);
      }
    }
  };

  let prevOpenState = useRef(state.isOpen);
  useEffect(() => {
    if (!state.isOpen && prevOpenState.current !== state.isOpen) {
      // Clear focused key whenever combobox menu closes so opening the menu via pressing the open button doesn't autofocus the last focused key
      state.selectionManager.setFocusedKey(null);

      // Refocus input when mobile tray closes for any reason
      // Readonly state is quickly swapped to suppress virtual keyboard from opening again on tray close
      if (isMobile) {
        inputRef.current.readOnly = true;
        inputRef.current?.focus({preventScroll: true});
        inputRef.current.readOnly = false;
      }
    }

    prevOpenState.current = state.isOpen;
  }, [state.isOpen, inputRef, isMobile, state.selectionManager]);

  let triggerLabelProps = useLabels({
    id: menuTriggerProps.id,
    'aria-label': 'Show suggestions',
    'aria-labelledby': props['aria-labelledby'] || labelProps.id
  });

  let listBoxProps = useLabels({
    id: menuProps.id,
    'aria-label': 'Suggestions',
    'aria-labelledby': props['aria-labelledby'] || labelProps.id
  });

  // If click happens on direct center of combobox input, might be virtual click from iPad so open combobox menu
  let onClick = (e) => {
    let rect = (e.target as HTMLElement).getBoundingClientRect();

    let middleOfRect = {
      x: Math.round(rect.left + .5 * rect.width),
      y: Math.round(rect.top + .5 * rect.height)
    };

    if (e.clientX === middleOfRect.x && e.clientY === middleOfRect.y) {
      inputRef.current.focus();
      state.open();
    }
  };

  return {
    labelProps,
    triggerProps: {
      ...menuTriggerProps,
      ...triggerLabelProps,
      excludeFromTabOrder: true,
      onPress,
      onPressStart
    },
    inputProps: {
      // Only add the inputPressProps if mobile so that text highlighting via mouse click + drag works on desktop
      // Substitute onClick for non-mobile cases so iPad voiceover virtual click on input opens the combobox menu
      ...mergeProps(inputProps, isMobile ? inputPressProps : {onClick}),
      role: 'combobox',
      'aria-expanded': menuTriggerProps['aria-expanded'],
      'aria-controls': state.isOpen ? menuId || menuProps.id : undefined,
      'aria-autocomplete': completionMode === 'suggest' ? 'list' : 'both',
      'aria-activedescendant': focusedKeyId
    },
    listBoxProps: mergeProps(menuProps, listBoxProps)
  };
}
