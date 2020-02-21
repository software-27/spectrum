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

import {AllHTMLAttributes, RefObject} from 'react';
import {mergeProps} from '@react-aria/utils';
import {Node} from '@react-stately/collections';
import {TreeState} from '@react-stately/tree';
import {usePress} from '@react-aria/interactions';
import {useSelectableItem} from '@react-aria/selection';

interface SideNavItemAriaProps<T> extends AllHTMLAttributes<HTMLElement>{
  item: Node<T>
}

interface SideNavItemAria {
  listItemProps: AllHTMLAttributes<HTMLDivElement>,
  listItemLinkProps: AllHTMLAttributes<HTMLAnchorElement>
}

export function useSideNavItem<T>(props: SideNavItemAriaProps<T>, state: TreeState<T>, ref: RefObject<HTMLAnchorElement | null>): SideNavItemAria {
  let {
    item,
    'aria-current': ariaCurrent
  } = props;

  let {itemProps} = useSelectableItem({
    selectionManager: state.selectionManager,
    itemKey: item.key,
    itemRef: ref
  });

  let {pressProps} = usePress(itemProps);

  return {
    listItemProps: {
      role: 'listitem'
    },
    listItemLinkProps: {
      role: 'link',
      target: '_self',
      'aria-current': item.isSelected ? ariaCurrent || 'page' : undefined,
      ...mergeProps(itemProps, pressProps)
    }
  };
}
