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

import {CollectionBuilderContext} from './useTableState';
import {PartialNode} from '@react-stately/collections';
import React, {ReactElement} from 'react';
import {RowProps} from '@react-types/table';

function Row<T>(props: RowProps<T>): ReactElement { // eslint-disable-line @typescript-eslint/no-unused-vars
  return null;
}

Row.getCollectionNode = function* getCollectionNode<T>(props: RowProps<T>, context: CollectionBuilderContext<T>): Generator<PartialNode<T>> {
  let {childItems, children, textValue} = props;

  yield {
    type: 'item',
    props: props,
    textValue,
    'aria-label': props['aria-label'],
    hasChildNodes: true,
    *childNodes() {
      // Process cells first
      if (context.showSelectionCheckboxes && context.selectionMode !== 'none') {
        yield {
          type: 'cell',
          key: 'header', // this is combined with the row key by CollectionBuilder
          props: {
            isSelectionCell: true
          }
        };
      }

      if (typeof children === 'function') {
        for (let column of context.columns) {
          yield {
            type: 'cell',
            element: children(column.key),
            key: column.key // this is combined with the row key by CollectionBuilder
          };
        }
      } else {
        let cells: PartialNode<T>[] = [];
        React.Children.forEach(children, cell => {
          cells.push({
            type: 'cell',
            element: cell
          });
        });

        if (cells.length !== context.columns.length) {
          throw new Error(`Cell count must match column count. Found ${cells.length} cells and ${context.columns.length} columns.`);
        }

        yield* cells;
      }

      // Then process child rows (e.g. treeble)
      if (childItems) {
        for (let child of childItems) {
          yield {
            type: 'item',
            value: child
          };
        }
      }
    },
    shouldInvalidate(newContext: CollectionBuilderContext<T>) {
      // Invalidate all rows if the columns changed.
      return newContext.columns.length !== context.columns.length ||
        newContext.columns.some((c, i) => c.key !== context.columns[i].key) ||
        newContext.showSelectionCheckboxes !== context.showSelectionCheckboxes ||
        newContext.selectionMode !== context.selectionMode;
    }
  };
};

// We don't want getCollectionNode to show up in the type definition
let _Row = Row as <T>(props: RowProps<T>) => JSX.Element;
export {_Row as Row};
