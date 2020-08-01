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

import {action} from '@storybook/addon-actions';
import {NumberField} from '../src';
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('NumberField', module)
  .addParameters({providerSwitcher: {status: 'notice'}})
  .add(
    'default',
    () => render({onChange: action('onChange')})
  )
  .add(
    'number formatter',
    () => render({formatOptions: {style: 'currency', currency: 'EUR'}})
  )
  .add(
    'isQuiet',
    () => render({isQuiet: true})
  )
  .add(
    'minValue = 0, maxValue = 20',
    () => render({minValue: 0, maxValue: 20})
  )
  .add(
    'minValue = 0, defaultValue = 0',
    () => render({minValue: 0, defaultValue: 0})
  )
  .add(
    'autoFocus',
    () => render({autoFocus: true})
  )
  .add(
    'controlled',
    () => <NumberFieldControlled />
  );

function render(props: any = {}) {
  return (
    <NumberField {...props} UNSAFE_className="custom_classname" />
  );
}

function NumberFieldControlled(props) {
  let [value, setValue] = useState(10);
  return <NumberField {...props} formatOptions={{style: 'currency', currency: 'EUR'}} value={value} onChange={setValue} />;
}
