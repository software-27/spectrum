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

import {ComboBoxProps} from '@react-types/combobox';
import {Key, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Node} from '@react-types/shared';
import {SelectState} from '@react-stately/select';
import {useControlledState} from '@react-stately/utils';
import {useMenuTriggerState} from '@react-stately/menu';
import {useSingleSelectListState} from '@react-stately/list';

export interface ComboBoxState<T> extends SelectState<T> {
  inputValue: string,
  setInputValue: (value: string) => void
}

interface ComboBoxStateProps<T> extends ComboBoxProps<T> {
  collator: Intl.Collator
}

function filter<T>(nodes: Iterable<Node<T>>, filterFn: (node: Node<T>) => boolean): Iterable<Node<T>> {
  let filteredNode = [];
  for (let node of nodes) {
    if (node.type === 'section' && node.hasChildNodes) {
      let copyOfNode = {...node};
      let copyOfChildNodes = copyOfNode.childNodes;
      let filtered = filter(copyOfChildNodes, filterFn);
      if ([...filtered].length > 0) {
        copyOfNode.childNodes = filtered;
        filteredNode.push(copyOfNode);
      }
    } else if (node.type !== 'section' && filterFn(node)) {
      filteredNode.push(node);
    }
  }
  return filteredNode;
}

export function useComboBoxState<T extends object>(props: ComboBoxStateProps<T>): ComboBoxState<T> {
  let {
    onFilter,
    collator,
    onSelectionChange
  } = props;

  let [isFocused, setFocused] = useState(false);
  let itemsControlled = !!onFilter;

  let computeKeyFromValue = (value, collection) => {
    let key;
    for (let [itemKey, node] of collection.keyMap) {
      if (node.type !== 'section') {
        let itemText = node.textValue;
        if (itemText === value) {
          key = itemKey;
          break;
        }
      }
    }

    return key;
  };

  // Need this collection here so that an initial inputValue can be found via collection.getItem
  // This is really just a replacement for using CollectionBuilder
  let {collection} = useSingleSelectListState({
    ...props,
    // default to null if props.selectedKey isn't set to avoid useControlledState's uncontrolled to controlled warning
    selectedKey: props.selectedKey || null
  });

  if (props.selectedKey && props.inputValue) {
    let selectedItem = collection.getItem(props.selectedKey);
    let itemText = selectedItem ? selectedItem.textValue : '';
    if (itemText !== props.inputValue) {
      throw new Error('Mismatch between selected item and inputValue!');
    }
  }

  let onInputChange = (value) => {
    if (props.onInputChange) {
      props.onInputChange(value);
    }

    let newSelectedKey = computeKeyFromValue(value, collection);
    if (newSelectedKey !== selectedKey) {
      if (onSelectionChange) {
        onSelectionChange(newSelectedKey);
      }
    }
  };

  let initialSelectedKeyText = collection.getItem(props.selectedKey)?.textValue;
  let initialDefaultSelectedKeyText = collection.getItem(props.defaultSelectedKey)?.textValue;
  let [inputValue, setInputValue] = useControlledState(toString(props.inputValue), initialSelectedKeyText || toString(props.defaultInputValue) || initialDefaultSelectedKeyText || '', onInputChange);

  let selectedKey = props.selectedKey || computeKeyFromValue(inputValue, collection);

  let triggerState = useMenuTriggerState(props);

  // Fires on selection change (when user hits Enter, clicks list item, props.selectedKey is changed)
  let setSelectedKey = useCallback((key) => {
    let item = collection.getItem(key);
    let itemText = item ? item.textValue : '';
    // think about the below conditionals below
    // If I don't have the extra itemText check, then setting props.selectedKey to undef or just deleting one letter of the text
    // so it doesn't match a key will then clear the textfield entirely (in controlled selected key case)
    // Problem with this is that a clear button w/ setSelectedKey = '' won't actually clear the textfield because of this itemText check (also controlled selected key only case, input value uncontrolled).
    itemText && setInputValue(itemText);

    // If itemText happens to be the same as the current input text but the keys don't match
    // setInputValue won't call onSelectionChange for us so we call it here manually
    if (itemText === inputValue && selectedKey !== key) {
      if (onSelectionChange) {
        onSelectionChange(key);
      }
    }

  }, [collection, setInputValue, inputValue, onSelectionChange, selectedKey]);

  // Update the selectedKey and inputValue when props.selectedKey updates
  let lastSelectedKeyProp = useRef('' as Key);
  useEffect(() => {
    // need this check since setSelectedKey changes a lot making this useEffect fire even when props.selectedKey hasn't changed
    if (lastSelectedKeyProp.current !== props.selectedKey) {
      setSelectedKey(props.selectedKey);
    }
    lastSelectedKeyProp.current = props.selectedKey;
  }, [props.selectedKey, setSelectedKey]);

  let lowercaseValue = inputValue.toLowerCase().replace(' ', '');

  let defaultFilterFn = useMemo(() => (node: Node<T>) => {
    let scan = 0;
    let lowercaseNode = node.textValue.toLowerCase().replace(' ', '');
    let sliceLen = lowercaseValue.length;
    let match = false;

    for (; scan + sliceLen <= lowercaseNode.length && !match; scan++) {
      let nodeSlice = lowercaseNode.slice(scan, scan + sliceLen);
      let compareVal = collator.compare(lowercaseValue, nodeSlice);
      if (compareVal === 0) {
        match = true;
      }
    }

    return match;
  }, [collator, lowercaseValue]);

  let lastValue = useRef('');
  useEffect(() => {
    if (onFilter && lastValue.current !== inputValue) {
      onFilter(inputValue);
    }

    lastValue.current = inputValue;
  }, [inputValue, onFilter]);

  let nodeFilter = useMemo(() => {
    if (itemsControlled || inputValue === '') {
      return null;
    }
    return (nodes) => filter(nodes, defaultFilterFn);
  }, [itemsControlled, inputValue, defaultFilterFn]);

  let {collection: filteredCollection, disabledKeys, selectionManager, selectedItem} = useSingleSelectListState(
    {
      ...props,
      // Fall back to null as the selectedKey to avoid useControlledState error of uncontrolled to controlled and viceversa
      selectedKey: selectedKey || null,
      onSelectionChange: (key: Key) => setSelectedKey(key),
      filter: nodeFilter
    }
  );

  // Prevent open operations from triggering if there is nothing to display
  let open = (focusStrategy?) => {
    if (filteredCollection.size > 0) {
      triggerState.open(focusStrategy);
    }
  };

  return {
    ...triggerState,
    open,
    selectionManager,
    selectedKey,
    setSelectedKey,
    disabledKeys,
    isFocused,
    setFocused,
    selectedItem,
    collection: filteredCollection,
    isOpen: triggerState.isOpen && isFocused && filteredCollection.size > 0,
    inputValue,
    setInputValue
  };
}

function toString(val) {
  if (val == null) {
    return;
  }

  return val.toString();
}
