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

import {act, renderHook} from '@testing-library/react-hooks';
import assert from 'assert';
import React from 'react';
import sinon from 'sinon';
import {useTabListState} from '../';

test.skip('test with react-hooks-testing, controled index', function () {
  let props = {
    selectedIndex: 1,
    onChange: sinon.spy()
  };
  let {result} = renderHook(() => useTabListState(props));
  assert.equal(1, result.current.selectedIndex);

  act(() => result.current.setSelectedIndex(3));
  assert.equal(1, result.current.selectedIndex);
  assert.equal(props.onChange.getCall(0).args[0], 3);
});

test.skip('test with react-hooks-testing, uncontrolled index', function () {
  let props = {
    defaultSelectedIndex: 1,
    onChange: sinon.spy()
  };
  let {result} = renderHook(() => useTabListState(props));
  assert.equal(1, result.current.selectedIndex);

  act(() => result.current.setSelectedIndex(3));
  assert.equal(3, result.current.selectedIndex);
  assert.equal(props.onChange.getCall(0).args[0], 3);
});
