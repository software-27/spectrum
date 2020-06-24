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

import {Collection, FocusStrategy, KeyboardDelegate, Node} from '@react-types/shared';
import {HTMLAttributes, Key, RefObject, useEffect, useMemo} from 'react';
import {ListKeyboardDelegate} from './ListKeyboardDelegate';
import {MultipleSelectionManager} from '@react-stately/selection';
import {useCollator} from '@react-aria/i18n';
import {useSelectableCollection} from './useSelectableCollection';

interface SelectableListOptions {
  selectionManager: MultipleSelectionManager,
  collection: Collection<Node<unknown>>,
  disabledKeys: Set<Key>,
  ref?: RefObject<HTMLElement>,
  keyboardDelegate?: KeyboardDelegate,
  autoFocus?: boolean | FocusStrategy,
  shouldFocusWrap?: boolean,
  isVirtualized?: boolean,
  disallowEmptySelection?: boolean
}

interface SelectableListAria {
  listProps: HTMLAttributes<HTMLElement>
}

export function useSelectableList(props: SelectableListOptions): SelectableListAria {
  let {
    selectionManager,
    collection,
    disabledKeys,
    ref,
    keyboardDelegate,
    autoFocus,
    shouldFocusWrap,
    isVirtualized,
    disallowEmptySelection
  } = props;

  // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
  // When virtualized, the layout object will be passed in as a prop and override this.
  let collator = useCollator({usage: 'search', sensitivity: 'base'});
  let delegate = useMemo(() => keyboardDelegate || new ListKeyboardDelegate(collection, disabledKeys, ref, collator), [keyboardDelegate, collection, disabledKeys, ref, collator]);

  // If not virtualized, scroll the focused element into view when the focusedKey changes.
  // When virtualized, Virtualizer handles this internally.
  useEffect(() => {
    if (!isVirtualized && selectionManager.focusedKey) {
      let element = ref.current.querySelector(`[data-key="${selectionManager.focusedKey}"]`) as HTMLElement;
      if (element) {
        scrollIntoView(ref.current, element);
      }
    }
  }, [isVirtualized, ref, selectionManager.focusedKey]);

  let {collectionProps} = useSelectableCollection({
    ref,
    selectionManager,
    keyboardDelegate: delegate,
    autoFocus,
    shouldFocusWrap,
    disallowEmptySelection
  });

  return {
    listProps: collectionProps
  };
}

// Scrolls `scrollView` so that `element` is visible.
// Similar to `element.scrollIntoView({block: 'nearest'})` (not supported in Edge),
// but doesn't affect parents above `scrollView`.
function scrollIntoView(scrollView: HTMLElement, element: HTMLElement) {
  let offsetX = element.offsetLeft - scrollView.offsetLeft;
  let offsetY = element.offsetTop - scrollView.offsetTop;
  let width = element.offsetWidth;
  let height = element.offsetHeight;
  let x = scrollView.scrollLeft;
  let y = scrollView.scrollTop;
  let maxX = x + scrollView.offsetWidth;
  let maxY = y + scrollView.offsetHeight;

  if (offsetX <= x) {
    x = offsetX;
  } else if (offsetX + width > maxX) {
    x += offsetX + width - maxX;
  }
  if (offsetY <= y) {
    y = offsetY;
  } else if (offsetY + height > maxY) {
    y += offsetY + height - maxY;
  }

  scrollView.scrollLeft = x;
  scrollView.scrollTop = y;
}
