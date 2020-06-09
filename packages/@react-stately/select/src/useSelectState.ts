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

import {Key, useMemo, useState} from 'react';
import {ListState, useListState} from '@react-stately/list';
import {MenuTriggerState, useMenuTriggerState} from '@react-stately/menu';
import {Node} from '@react-types/shared';
import {SelectProps} from '@react-types/select';
import {useControlledState} from '@react-stately/utils';

export interface SelectState<T> extends ListState<T>, MenuTriggerState {
  /** The key for the currently selected item. */
  readonly selectedKey: Key,

  /** Sets the selected key. */
  setSelectedKey(key: Key): void,

  /** The value of the currently selected item. */
  readonly selectedItem: Node<T>,

  /** Whether the select is currently focused. */
  readonly isFocused: boolean,

  /** Sets whether the select is focused. */
  setFocused(isFocused: boolean): void
}

/**
 * Provides state management for a select component. Handles building a collection
 * of items from props, handles the open state for the popup menu, and manages
 * multiple selection state.
 */
export function useSelectState<T extends object>(props: SelectProps<T>): SelectState<T>  {
  let [selectedKey, setSelectedKey] = useControlledState(props.selectedKey, props.defaultSelectedKey, props.onSelectionChange);
  let selectedKeys = useMemo(() => selectedKey != null ? [selectedKey] : [], [selectedKey]);
  let triggerState = useMenuTriggerState(props);
  let {collection, disabledKeys, selectionManager} = useListState({
    ...props,
    selectionMode: 'single',
    disallowEmptySelection: true,
    selectedKeys,
    onSelectionChange: (keys: Set<Key>) => {
      setSelectedKey(keys.values().next().value);
      triggerState.close();
    }
  });

  let selectedItem = selectedKey
    ? collection.getItem(selectedKey)
    : null;

  let [isFocused, setFocused] = useState(false);

  return {
    ...triggerState,
    open() {
      // Don't open if the collection is empty.
      if (collection.size !== 0) {
        triggerState.open();
      }
    },
    toggle(focusStrategy) {
      if (collection.size !== 0) {
        triggerState.toggle(focusStrategy);
      }
    },
    collection,
    disabledKeys,
    selectionManager,
    selectedKey,
    setSelectedKey,
    selectedItem,
    isFocused,
    setFocused
  };
}
