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

import {CollectionBase, MultipleSelection, SelectionMode} from '@react-types/shared';
import {CollectionBuilder, Node} from '@react-stately/collections';
import {GridCollection} from './GridCollection';
import {Key, useMemo, useRef} from 'react';
import {SelectionManager, useMultipleSelectionState} from '@react-stately/selection';

export interface GridState<T> {
  collection: GridCollection<T>,
  disabledKeys: Set<Key>,
  selectionManager: SelectionManager,
  showSelectionCheckboxes: boolean
}

export interface CollectionBuilderContext<T> {
  showSelectionCheckboxes: boolean,
  selectionMode: SelectionMode,
  columns: Node<T>[]
}

export interface GridStateProps<T> extends CollectionBase<T>, MultipleSelection {
  showSelectionCheckboxes?: boolean
}

export function useGridState<T extends object>(props: GridStateProps<T>): GridState<T>  {
  let selectionState = useMultipleSelectionState(props);
  let disabledKeys = useMemo(() =>
    props.disabledKeys ? new Set(props.disabledKeys) : new Set<Key>()
  , [props.disabledKeys]);
  
  let builder = useMemo(() => new CollectionBuilder<T>(props.itemKey), [props.itemKey]);
  let collectionRef = useRef<GridCollection<T>>();
  let collection = useMemo(() => {
    let context = {
      showSelectionCheckboxes: props.showSelectionCheckboxes && selectionState.selectionMode !== 'none',
      selectionMode: selectionState.selectionMode,
      columns: []
    };
  
    let nodes = builder.build(props, context);

    collectionRef.current = new GridCollection(nodes, collectionRef.current, context);
    return collectionRef.current;
  }, [props, selectionState.selectionMode, builder]);

  return {
    collection,
    disabledKeys,
    selectionManager: new SelectionManager(collection, selectionState),
    showSelectionCheckboxes: props.showSelectionCheckboxes || false
  };
}
