/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {addWindowFocusTracking} from '../src';
import {Cell, Column, Row, TableBody, TableHeader, TableView} from '@react-spectrum/table';
import {Key} from '@react-types/shared';
import {mergeProps} from '@react-aria/utils';
import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {SearchField} from '@react-spectrum/searchfield';
import {useButton} from '@react-aria/button';
import {useFocusRing} from '@react-aria/focus';

interface IColumn {
  name: string,
  key: string
}
interface IRow {
  key: string
}

let manyColumns: IColumn[] = [];
for (let i = 0; i < 100; i++) {
  manyColumns.push(
    i === 0
      ? {name: 'Column name', key: 'C0'}
      : {name: 'Column ' + i, key: 'C' + i}
  );
}

let manyRows: IRow[] = [];
for (let i = 0; i < 1000; i++) {
  let row = {key: 'R' + i};
  for (let j = 0; j < 100; j++) {
    row['C' + j] = j === 0 ? `Row ${i}` : `${i}, ${j}`;
  }

  manyRows.push(row);
}

export default {
  title: 'useFocusRing'
};

export const SearchTableview = {
  render: () => <SearchExample />,
  name: 'search + tableview',
  parameters: {
    a11y: {
      config: {
        // Fails due to TableView's known issue, ignoring here since it isn't pertinent to the story
        rules: [{id: 'aria-required-children', selector: '*:not([role="grid"])'}]
      }
    }
  }
};

export const IFrame = {
  render: () => <IFrameExample />,
  name: 'focus state in dynamic iframe'
};

function SearchExample() {
  const [items, setItems] = useState(manyRows);

  return (
    <div>
      <SearchField
        aria-label="table searchfield"
        onChange={(value) => {
          const newItems = manyRows.filter((item) =>
            item['C0'].toLowerCase().includes(value.toLowerCase())
          );
          setItems(newItems);
        }} />
      <TableView aria-label="Searchable table with many columns and rows" selectionMode="multiple" width={700} height={500}>
        <TableHeader columns={manyColumns}>
          {column =>
            <Column minWidth={100}>{column.name}</Column>
          }
        </TableHeader>
        <TableBody items={items}>
          {item =>
            (<Row key={item.key}>
              {(key: Key) => <Cell>{item[key]}</Cell>}
            </Row>)
          }
        </TableBody>
      </TableView>
    </div>
  );
}

function Button() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const {buttonProps} = useButton({}, buttonRef);
  const {focusProps, isFocusVisible, isFocused} = useFocusRing();

  return (
    <button ref={buttonRef} {...mergeProps(buttonProps, focusProps)}>
      Focus Visible: {isFocusVisible ? 'true' : 'false'} <br />
      Focused: {isFocused ? 'true' : 'false'}
    </button>
  );
}

const IframeWrapper = ({children}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const main = document.createElement('main');
      const iframeDocument = iframeRef.current.contentDocument;

      if (iframeDocument) {
        iframeDocument.body.innerHTML = '';
        iframeDocument.body.appendChild(main);
        ReactDOM.render(children, main);

        return addWindowFocusTracking(iframeDocument.body);
      }
    }
  }, [children]);

  return <iframe title="test" ref={iframeRef} />;
};

function IFrameExample() {
  return (
    <>
      <Button />
      <IframeWrapper>
        <Button />
        <Button />
        <Button />
      </IframeWrapper>
    </>
  );
}
