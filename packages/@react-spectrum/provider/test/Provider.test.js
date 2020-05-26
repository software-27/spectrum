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

// needs to be imported first
import MatchMediaMock from 'jest-matchmedia-mock';
// eslint-disable-next-line rulesdir/sort-imports
import {act, render} from '@testing-library/react';
import {Button} from '@react-spectrum/button';
import {Checkbox} from '@react-spectrum/checkbox';
import {Provider} from '../';
import React from 'react';
import {Switch} from '@react-spectrum/switch';
import {triggerPress} from '@react-spectrum/test-utils';
import userEvent from '@testing-library/user-event';

let theme = {
  global: {},
  light: {'spectrum--light': 'spectrum--light'},
  dark: {'spectrum--dark': 'spectrum--dark'},
  medium: {'spectrum--medium': 'spectrum--medium'},
  large: {'spectrum--large': 'spectrum--large'}
};
let mediaQueryLight = '(prefers-color-scheme: light)';
let mediaQueryDark = '(prefers-color-scheme: dark)';

describe('Provider', () => {
  let matchMedia;
  beforeEach(() => {
    matchMedia = new MatchMediaMock();
  });
  afterEach(() => {
    matchMedia.clear();
  });

  it('Uses OS theme by default - dark', () => {
    matchMedia.useMediaQuery(mediaQueryDark);
    let {getByTestId} = render(<Provider theme={theme} data-testid="testid"><div>hello</div></Provider>);
    let provider = getByTestId('testid');
    expect(provider.classList.contains('spectrum--dark')).toBeTruthy();
  });

  it('Uses OS theme by default - light', () => {
    matchMedia.useMediaQuery(mediaQueryLight);
    let {getByTestId} = render(<Provider theme={theme} data-testid="testid"><div>hello</div></Provider>);
    let provider = getByTestId('testid');
    expect(provider.classList.contains('spectrum--light')).toBeTruthy();
  });

  it('Can be set to dark regardless of OS setting', () => {
    matchMedia.useMediaQuery(mediaQueryLight);
    let {getByTestId} = render(<Provider theme={theme} colorScheme="dark" data-testid="testid"><div>hello</div></Provider>);
    let provider = getByTestId('testid');
    expect(provider.classList.contains('spectrum--dark')).toBeTruthy();
  });

  it('Provider passes props to children', () => {
    let onChangeSpy = jest.fn();
    let {getByLabelText} = render(
      <Provider theme={theme} isReadOnly>
        <Checkbox onChange={onChangeSpy}>Test Checkbox</Checkbox>
        <Switch onChange={onChangeSpy}>Test Switch</Switch>
      </Provider>
    );

    let checkbox = getByLabelText('Test Checkbox');
    let switchComponent = getByLabelText('Test Switch');

    expect(switchComponent).toHaveAttribute('readonly');
    expect(checkbox).toHaveAttribute('readonly');

    act(() => {
      userEvent.click(checkbox);
      userEvent.click(switchComponent);
    });

    expect(onChangeSpy).not.toHaveBeenCalled();
    onChangeSpy.mockClear();
  });

  it('Nested providers follow their ancestors by default, not the OS', () => {
    matchMedia.useMediaQuery(mediaQueryLight);
    let {getByTestId} = render(
      <Provider theme={theme} colorScheme="dark" data-testid="testid1">
        <Provider data-testid="testid2">
          <div>hello</div>
        </Provider>
      </Provider>
    );
    let provider1 = getByTestId('testid1');
    let provider2 = getByTestId('testid2');
    expect(provider1.classList.contains('spectrum--dark')).toBeTruthy();
    expect(provider2.classList.contains('spectrum--dark')).toBeTruthy();
  });

  it('Nested providers can update to follow their ancestors', () => {
    matchMedia.useMediaQuery(mediaQueryDark);
    let NestedProviders = (props) => (
      <Provider theme={theme} colorScheme={props.colorScheme} data-testid="testid1">
        <Provider data-testid="testid2">
          <div>hello</div>
        </Provider>
      </Provider>
    );
    let {getByTestId, rerender} = render(<NestedProviders />);
    let provider1 = getByTestId('testid1');
    let provider2 = getByTestId('testid2');
    expect(provider1.classList.contains('spectrum--dark')).toBeTruthy();
    expect(provider2.classList.contains('spectrum--dark')).toBeTruthy();

    rerender(<NestedProviders colorScheme="light" />);
    provider1 = getByTestId('testid1');
    provider2 = getByTestId('testid2');
    expect(provider1.classList.contains('spectrum--light')).toBeTruthy();
    expect(provider2.classList.contains('spectrum--light')).toBeTruthy();
  });

  it('Nested providers can be explicitly set to something else', () => {
    matchMedia.useMediaQuery(mediaQueryLight);
    let {getByTestId} = render(
      <Provider theme={theme} colorScheme="dark" data-testid="testid1">
        <Provider colorScheme="light" data-testid="testid2">
          <div>hello</div>
        </Provider>
      </Provider>
    );
    let provider1 = getByTestId('testid1');
    let provider2 = getByTestId('testid2');
    expect(provider1.classList.contains('spectrum--dark')).toBeTruthy();
    expect(provider2.classList.contains('spectrum--light')).toBeTruthy();
  });

  it('Nested providers pass props to children', () => {
    let onPressSpy = jest.fn();
    let {getByRole} = render(
      <Provider theme={theme} isDisabled>
        <Provider isQuiet>
          <Button onPress={onPressSpy}>Hello!</Button>
        </Provider>
      </Provider>
    );
    let button = getByRole('button');
    triggerPress(button);
    expect(onPressSpy).not.toHaveBeenCalled();
    expect(button.classList.contains('spectrum-Button--quiet')).toBeTruthy();
    onPressSpy.mockClear();
  });

  it('will render an available color scheme automatically if the previous does not exist on the new theme', () => {
    matchMedia.useMediaQuery(mediaQueryDark);
    let {getByTestId} = render(
      <Provider theme={theme} data-testid="testid1">
        <Provider
          theme={{
            global: {},
            light: {'spectrum--light': 'spectrum--light'},
            medium: {'spectrum--medium': 'spectrum--medium'},
            large: {'spectrum--large': 'spectrum--large'}
          }}
          data-testid="testid2">
          <Button>Hello!</Button>
        </Provider>
      </Provider>
    );
    let provider1 = getByTestId('testid1');
    let provider2 = getByTestId('testid2');
    expect(provider1.classList.contains('spectrum--dark')).toBeTruthy();
    expect(provider2.classList.contains('spectrum--light')).toBeTruthy();
  });

  it('Provider will rerender if the OS preferred changes and it is on auto', () => {
    matchMedia.useMediaQuery(mediaQueryLight);
    let {getByTestId} = render(
      <Provider theme={theme} data-testid="testid1">
        <Provider data-testid="testid2">
          <div>hello</div>
        </Provider>
      </Provider>
    );
    let provider1 = getByTestId('testid1');
    let provider2 = getByTestId('testid2');
    expect(provider1.classList.contains('spectrum--light')).toBeTruthy();
    expect(provider2.classList.contains('spectrum--light')).toBeTruthy();

    act(() => {
      matchMedia.useMediaQuery(mediaQueryDark);
    });
    
    expect(provider1.classList.contains('spectrum--dark')).toBeTruthy();
    expect(provider2.classList.contains('spectrum--dark')).toBeTruthy();
  });
});
