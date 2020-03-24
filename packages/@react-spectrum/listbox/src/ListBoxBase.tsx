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

import {classNames, filterDOMProps, useStyleProps} from '@react-spectrum/utils';
import {CollectionItem, CollectionView} from '@react-aria/collections';
import {DOMProps, StyleProps} from '@react-types/shared';
import {FocusStrategy} from '@react-types/menu';
import {ListBoxOption} from './ListBoxOption';
import {ListBoxSection} from './ListBoxSection';
import {ListLayout, Node} from '@react-stately/collections';
import {ListState} from '@react-stately/list';
import {mergeProps} from '@react-aria/utils';
import React, {HTMLAttributes, ReactElement, useMemo} from 'react';
import {ReusableView} from '@react-stately/collections';
import styles from '@adobe/spectrum-css-temp/components/menu/vars.css';
import {useCollator} from '@react-aria/i18n';
import {useListBox} from '@react-aria/listbox';
import {useProvider} from '@react-spectrum/provider';

interface ListBoxBaseProps<T> extends DOMProps, StyleProps {
  layout: ListLayout<T>,
  state: ListState<T>,
  autoFocus?: boolean,
  focusStrategy?: FocusStrategy,
  wrapAround?: boolean,
  selectOnPressUp?: boolean,
  focusOnPointerEnter?: boolean,
  domProps?: HTMLAttributes<HTMLElement>
}

export function useListBoxLayout<T>(state: ListState<T>) {
  let {scale} = useProvider();
  let collator = useCollator({usage: 'search', sensitivity: 'base'});
  let layout = useMemo(() => 
    new ListLayout({
      estimatedRowHeight: scale === 'large' ? 48 : 35,
      estimatedHeadingHeight: scale === 'large' ? 37 : 30,
      collator
    })
  , [collator, scale]);

  layout.collection = state.collection;
  return layout;
}

export function ListBoxBase<T>(props: ListBoxBaseProps<T>) {
  let {layout, state, selectOnPressUp, focusOnPointerEnter, domProps = {}} = props;
  let {listBoxProps} = useListBox({
    ...props,
    ...domProps,
    keyboardDelegate: layout,
    isVirtualized: true
  }, state);
  let {styleProps} = useStyleProps(props);

  // This overrides collection view's renderWrapper to support heirarchy of items in sections.
  // The header is extracted from the children so it can receive ARIA labeling properties.
  type View = ReusableView<Node<T>, unknown>;
  let renderWrapper = (parent: View, reusableView: View, children: View[], renderChildren: (views: View[]) => ReactElement[]) => {
    if (reusableView.viewType === 'section') {
      return (
        <ListBoxSection
          key={reusableView.key}
          state={state}
          reusableView={reusableView}
          header={children.find(c => c.viewType === 'header')}>
          {renderChildren(children.filter(c => c.viewType === 'item'))}
        </ListBoxSection>
      );
    }

    return (
      <CollectionItem 
        key={reusableView.key}
        reusableView={reusableView}
        parent={parent} />
    );
  };

  return (
    <CollectionView
      {...filterDOMProps(props)}
      {...styleProps}
      {...mergeProps(listBoxProps, domProps)}
      focusedKey={state.selectionManager.focusedKey}
      sizeToFit="height"
      className={
        classNames(
          styles, 
          'spectrum-Menu',
          styleProps.className
        )
      }
      layout={layout}
      collection={state.collection}
      renderWrapper={renderWrapper}>
      {(type, item) => {
        if (type === 'item') {
          return (
            <ListBoxOption
              item={item}
              state={state}
              selectOnPressUp={selectOnPressUp}
              focusOnHover={focusOnPointerEnter} />
          );
        }
      }}
    </CollectionView>
  );
}
