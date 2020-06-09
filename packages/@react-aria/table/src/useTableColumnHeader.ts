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

import {getColumnHeaderId} from './utils';
import {HTMLAttributes, RefObject} from 'react';
import {mergeProps} from '@react-aria/utils';
import {Node} from '@react-types/shared';
import {TableState} from '@react-stately/table';
import {usePress} from '@react-aria/interactions';
import {useTableCell} from './useTableCell';

interface ColumnHeaderProps {
  node: Node<unknown>,
  ref: RefObject<HTMLElement>,
  isVirtualized?: boolean,
  colspan?: number
}

interface ColumnHeaderAria {
  columnHeaderProps: HTMLAttributes<HTMLElement>
}

export function useTableColumnHeader<T>(props: ColumnHeaderProps, state: TableState<T>): ColumnHeaderAria {
  let {node, colspan} = props;
  let {gridCellProps} = useTableCell(props, state);

  let {pressProps} = usePress({
    isDisabled: !node.props.allowsSorting,
    onPress() {
      state.sort(node.key);
    }
  });

  let ariaSort: HTMLAttributes<HTMLElement>['aria-sort'] = null;
  if (node.props.allowsSorting) {
    ariaSort = state.sortDescriptor?.column === node.key ? state.sortDescriptor.direction : 'none';
  }

  return {
    columnHeaderProps: {
      ...mergeProps(gridCellProps, pressProps),
      role: 'columnheader',
      id: getColumnHeaderId(state, node.key),
      'aria-colspan': colspan && colspan > 1 ? colspan : null,
      'aria-sort': ariaSort
    }
  };
}
