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

import {act, fireEvent, render, within} from '@testing-library/react';
import {Button} from '@react-spectrum/button';
import {ComboBox, Item, Section} from '../';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import scaleMedium from '@adobe/spectrum-css-temp/vars/spectrum-medium-unique.css';
import themeLight from '@adobe/spectrum-css-temp/vars/spectrum-light-unique.css';
import {triggerPress} from '@react-spectrum/test-utils';
import userEvent from '@testing-library/user-event';

let theme = {
  light: themeLight,
  medium: scaleMedium
};

let onSelectionChange = jest.fn();
let onOpenChange = jest.fn();
let onFilter = jest.fn();
let onInputChange = jest.fn();
let outerBlur = jest.fn();
let onBlur = jest.fn();
let onCustomValue = jest.fn();

let defaultProps = {
  label: 'Test',
  placeholder: 'Select a topic...',
  onSelectionChange,
  onOpenChange,
  onInputChange,
  onBlur,
  onCustomValue
};

function renderComboBox(props = {}) {
  return render(
    <Provider theme={theme}>
      <ComboBox {...defaultProps} {...props}>
        <Item key="1">One</Item>
        <Item key="2">Two</Item>
        <Item key="3">Three</Item>
      </ComboBox>
    </Provider>
  );
}

function renderSectionComboBox(props = {}) {
  return render(
    <Provider theme={theme}>
      <ComboBox {...defaultProps} {...props}>
        <Section title="Section One" key="section 1">
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Section>
        <Section title="Section Two" key="section 2">
          <Item key="4">Four</Item>
          <Item key="5">Five</Item>
          <Item key="6">Six</Item>
        </Section>
      </ComboBox>
    </Provider>
  );
}

function testComboBoxOpen(combobox, button, listbox, focusedItemIndex) {
  expect(listbox).toBeVisible();
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(button).toHaveAttribute('aria-controls', listbox.id);
  expect(combobox).toHaveAttribute('aria-controls', listbox.id);

  let items = within(listbox).getAllByRole('option');
  expect(items).toHaveLength(3);
  expect(items[0]).toHaveTextContent('One');
  expect(items[1]).toHaveTextContent('Two');
  expect(items[2]).toHaveTextContent('Three');

  expect(document.activeElement).toBe(combobox);
  expect(combobox).toHaveAttribute('aria-activedescendant', items[focusedItemIndex].id);
}

describe('ComboBox', function () {
  beforeAll(function () {
    jest.spyOn(window.HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => 1000);
    jest.spyOn(window.HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => 1000);
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 0));
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    act(() => jest.runAllTimers());
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('renders correctly', function () {
    let {getAllByText, getByRole} = renderComboBox();

    let combobox = getByRole('combobox');
    expect(combobox).toHaveAttribute('placeholder', 'Select a topic...');

    let button = getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox'); // i think we really want 'listbox'?

    let label = getAllByText('Test')[0];
    expect(label).toBeVisible();
  });

  it('features default behavior of completionMode suggest and menuTrigger input', function () {
    let {getByRole} = renderComboBox();

    let combobox = getByRole('combobox');
    expect(combobox).not.toHaveAttribute('aria-controls');
    expect(combobox).not.toHaveAttribute('aria-activedescendant');
    expect(combobox).toHaveAttribute('aria-autocomplete', 'list');

    act(() => {
      combobox.focus();
      userEvent.type(combobox, 'On');
      jest.runAllTimers();
    });

    let listbox = getByRole('listbox');

    let items = within(listbox).getAllByRole('option');
    expect(items).toHaveLength(1);

    expect(combobox.value).toBe('On');
    expect(items[0]).toHaveTextContent('One');
    expect(combobox).toHaveAttribute('aria-controls', listbox.id);
    expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);
  });

  it('attaches a ref to the input field if provided as a prop', function () {
    let ref = React.createRef();
    let {getByRole} = renderComboBox({ref});

    let combobox = getByRole('combobox');
    expect(ref.current.getInputElement()).toEqual(combobox);
  });

  describe('opening', function () {
    describe('menuTrigger = focus', function () {
      it('opens menu when combobox is focused', function () {
        let {getByRole} = renderComboBox({menuTrigger: 'focus'});

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        act(() => {
          combobox.focus();
          jest.runAllTimers();
        });
        expect(onOpenChange).toHaveBeenLastCalledWith(true);

        let listbox = getByRole('listbox');
        expect(onOpenChange).toBeCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(true);
        testComboBoxOpen(combobox, button, listbox, 0);
      });
    });

    describe('via isOpen and defaultOpen', function () {
      it('has a controlled open state via isOpen', function () {
        let {getByRole} = renderComboBox({isOpen: true});

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        expect(() => getByRole('listbox')).toThrow();

        act(() => {
          combobox.focus();
          jest.runAllTimers();
        });

        let listbox = getByRole('listbox');
        expect(onOpenChange).toBeCalledTimes(0);
        testComboBoxOpen(combobox, button, listbox, 0);

        act(() => {
          triggerPress(button);
          jest.runAllTimers();
        });

        expect(listbox).toBeVisible();
        expect(onOpenChange).toBeCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });

      it('has a uncontrolled open state via defaultOpen', function () {
        let {getByRole} = renderComboBox({defaultOpen: true});

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        expect(() => getByRole('listbox')).toThrow();

        act(() => {
          combobox.focus();
          jest.runAllTimers();
        });

        let listbox = getByRole('listbox');
        expect(onOpenChange).toBeCalledTimes(0);
        testComboBoxOpen(combobox, button, listbox, 0);

        act(() => {
          triggerPress(button);
          jest.runAllTimers();
        });

        expect(() => getByRole('listbox')).toThrow();
        expect(onOpenChange).toBeCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(button).not.toHaveAttribute('aria-controls');
        expect(combobox).not.toHaveAttribute('aria-controls');
      });
    });

    describe('button click', function () {
      it('keeps focus within the textfield after opening the menu', function () {
        let {getByRole} = renderComboBox();

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        expect(() => getByRole('listbox')).toThrow();

        act(() => {
          combobox.focus();
          triggerPress(button);
          jest.runAllTimers();
        });

        let listbox = getByRole('listbox');
        expect(listbox).toBeTruthy;
        expect(document.activeElement).toBe(combobox);
      });

      // Double check this test
      // it('fires onFilter if there are no items loaded yet', function () {
      //   let {getByRole} = render(
      //     <Provider theme={theme}>
      //       <ComboBox label="Test" onOpenChange={onOpenChange} onFilter={onFilter} items={[]}>
      //         {(item) => <Item key={item.key}>{item.name}</Item>}
      //       </ComboBox>
      //     </Provider>
      //   );

      //   let button = getByRole('button');
      //   act(() => {
      //     triggerPress(button);
      //     jest.runAllTimers();
      //   });

      //   expect(onFilter).toHaveBeenCalled();

      //   expect(onOpenChange).toHaveBeenCalledWith(true);
      //   expect(onOpenChange).toHaveBeenCalledTimes(1);

      //   expect(() => getByRole('listbox')).toThrow();
      // });

      it('focuses first item if there are items loaded', function () {
        let {getByRole} = renderComboBox();

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        act(() => {
          triggerPress(button);
          jest.runAllTimers();
        });

        expect(onOpenChange).toHaveBeenCalledWith(true);

        let listbox = getByRole('listbox');
        testComboBoxOpen(combobox, button, listbox, 0);
      });

      it('opens for touch', () => {
        let {getByRole} = renderComboBox({});

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        expect(document.activeElement).not.toBe(combobox);

        act(() => {
          fireEvent.touchStart(button, {targetTouches: [{identifier: 1}]});
          fireEvent.touchEnd(button, {changedTouches: [{identifier: 1, clientX: 0, clientY: 0}]});
          jest.runAllTimers();
        });

        expect(document.activeElement).toBe(combobox);
        let listbox = getByRole('listbox');
        expect(listbox).toBeTruthy;
        expect(document.activeElement).toBe(combobox);
      });
    });

    describe('keyboard input', function () {
      it('opens the menu on down arrow press', function () {
        let {getByRole} = renderComboBox();

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        combobox.focus();
        expect(() => getByRole('listbox')).toThrow();

        act(() => {
          fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
          jest.runAllTimers();
        });

        let listbox = getByRole('listbox');
        testComboBoxOpen(combobox, button, listbox, 0);
      });

      it('opens the menu on up arrow press', function () {
        let {getByRole} = renderComboBox();

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        combobox.focus();
        expect(() => getByRole('listbox')).toThrow();

        act(() => {
          fireEvent.keyDown(combobox, {key: 'ArrowUp', code: 38, charCode: 38});
          jest.runAllTimers();
        });

        let listbox = getByRole('listbox');
        testComboBoxOpen(combobox, button, listbox, 2);
      });

      it('opens the menu on user typing', function () {
        let {getByRole} = renderComboBox();

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        combobox.focus();
        expect(() => getByRole('listbox')).toThrow();

        act(() => {
          userEvent.type(combobox, 'Two');
          jest.runAllTimers();
        });

        let listbox = getByRole('listbox');
        expect(listbox).toBeVisible();
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(button).toHaveAttribute('aria-controls', listbox.id);
        expect(combobox).toHaveAttribute('aria-controls', listbox.id);

        let items = within(listbox).getAllByRole('option');
        expect(items).toHaveLength(1);
        expect(items[0]).toHaveTextContent('Two');

        expect(document.activeElement).toBe(combobox);
        expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);
      });

      it('closes the menu if there are no matching items', function () {
        let {getByRole} = renderComboBox();

        let button = getByRole('button');
        let combobox = getByRole('combobox');
        act(() => {
          combobox.focus();
        });
        act(() => {
          userEvent.type(combobox, 'One');
        });
        act(() => jest.runAllTimers());

        let listbox = getByRole('listbox');
        let items = within(listbox).getAllByRole('option');
        expect(items).toHaveLength(1);


        act(() => {
          userEvent.type(combobox, 'z');
        });
        act(() => jest.runAllTimers());
        expect(() => getByRole('listbox')).toThrow();
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(button).not.toHaveAttribute('aria-controls');
        expect(combobox).not.toHaveAttribute('aria-controls');
      });

      it('doesn\'t opens the menu on user typing if menuTrigger=manual', function () {
        let {getByRole} = renderComboBox({menuTrigger: 'manual'});

        let combobox = getByRole('combobox');
        act(() => {
          combobox.focus();
        });
        act(() => {
          userEvent.type(combobox, 'One');
          jest.runAllTimers();
        });

        expect(() => getByRole('listbox')).toThrow();

        let button = getByRole('button');
        act(() => {
          triggerPress(button);
          () => jest.runAllTimers();
        });

        let listbox = getByRole('listbox');
        expect(listbox).toBeTruthy;
      });
    });
  });
  describe('showing menu', function () {
    it('moves to selected key', function () {
      let {getByRole} = renderComboBox({selectedKey: '2'});

      let button = getByRole('button');
      let combobox = getByRole('combobox');
      act(() => {
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');

      let items = within(listbox).getAllByRole('option');

      expect(document.activeElement).toBe(combobox);
      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);
      expect(items[0]).toHaveTextContent('Two');
    });

    it('moves to selected key (isOpen=true)', function () {
      let {getByRole} = renderComboBox({selectedKey: '2', isOpen: true});

      let combobox = getByRole('combobox');

      act(() => {
        combobox.focus();
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');

      let items = within(listbox).getAllByRole('option');

      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);
    });

    it('moves to first item for no selected key',  function () {
      let {getByRole} = renderComboBox();

      let button = getByRole('button');
      let combobox = getByRole('combobox');
      act(() => {
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      testComboBoxOpen(combobox, button, listbox, 0);
    });

    it('moves to first item for no selected key (isOpen=true)', function () {
      let {getByRole} = renderComboBox({isOpen: true});

      let combobox = getByRole('combobox');
      let button = getByRole('button');
      act(() => {
        combobox.focus();
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      testComboBoxOpen(combobox, button, listbox, 0);
    });

    it('does not auto focus a item if no selected key and allowsCustomValue=true', function () {
      let {getByRole} = renderComboBox({allowsCustomValue: true});

      let button = getByRole('button');
      let combobox = getByRole('combobox');
      act(() => {
        triggerPress(button);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(combobox);
      expect(combobox).not.toHaveAttribute('aria-activedescendant');
    });

    it('does auto focus the selected key if allowsCustomValue is true', function () {
      let {getByRole} = renderComboBox({selectedKey: '2', allowsCustomValue: true});

      let button = getByRole('button');
      let combobox = getByRole('combobox');
      act(() => {
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');

      let items = within(listbox).getAllByRole('option');

      expect(document.activeElement).toBe(combobox);
      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);
    });

    it('keeps the menu open if the user clears the input field', function () {
      let {getByRole} = renderComboBox();

      let button = getByRole('button');
      let combobox = getByRole('combobox');
      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'Two');
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(1);

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      listbox = getByRole('listbox');
      items = within(listbox).getAllByRole('option');
      expect(listbox).toBeVisible();
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls', listbox.id);
      expect(combobox).toHaveAttribute('aria-controls', listbox.id);
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[2]).toHaveTextContent('Three');

      expect(document.activeElement).toBe(combobox);
      expect(combobox).not.toHaveAttribute('aria-activedescendant');
    });

    it('allows the user to navigate the menu via arrow keys', function () {
      let {getByRole} = renderComboBox();

      let button = getByRole('button');
      let combobox = getByRole('combobox');
      act(() => {
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');

      expect(document.activeElement).toBe(combobox);
      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);

      act(() => {
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
      });

      expect(combobox).toHaveAttribute('aria-activedescendant', items[1].id);

      act(() => {
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
      });

      expect(combobox).toHaveAttribute('aria-activedescendant', items[2].id);

      act(() => {
        fireEvent.keyDown(combobox, {key: 'ArrowUp', code: 38, charCode: 38});
      });

      expect(combobox).toHaveAttribute('aria-activedescendant', items[1].id);
    });

    it('allows the user to select an item via Enter', function () {
      let {getByRole} = renderComboBox();

      let button = getByRole('button');
      let combobox = getByRole('combobox');
      expect(combobox.value).toBe('');
      act(() => {
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');

      expect(document.activeElement).toBe(combobox);
      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);

      act(() => {
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
      });

      expect(combobox).toHaveAttribute('aria-activedescendant', items[1].id);

      act(() => {
        fireEvent.keyDown(combobox, {key: 'Enter', code: 13, charCode: 13});
        jest.runAllTimers();
      });

      expect(() => getByRole('listbox')).toThrow();
      expect(combobox.value).toBe('Two');
      expect(onSelectionChange).toHaveBeenCalledWith('2');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
    });

    it('focuses the first key if the previously focused key is filtered out of the list', function () {
      let {getByRole} = renderComboBox();

      let combobox = getByRole('combobox');
      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'O');
        jest.runAllTimers();
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
      });

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(2);
      expect(combobox).toHaveAttribute('aria-activedescendant', items[1].id);
      expect(items[1].textContent).toBe('Two');

      act(() => {
        userEvent.type(combobox, 'n');
        jest.runAllTimers();
      });

      listbox = getByRole('listbox');
      items = within(listbox).getAllByRole('option');
      expect(combobox.value).toBe('On');
      expect(items).toHaveLength(1);
      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);
      expect(items[0].textContent).toBe('One');
    });
  });

  describe('typing in the textfield', function () {
    it('can be uncontrolled', function () {
      let {getByRole} = render(
        <Provider theme={theme}>
          <ComboBox label="Test" onOpenChange={onOpenChange}>
            <Item key="1">Bulbasaur</Item>
            <Item key="2">Squirtle</Item>
            <Item key="3">Charmander</Item>
          </ComboBox>
        </Provider>
      );

      let combobox = getByRole('combobox');
      act(() => {
        combobox.focus();
      });

      act(() => {
        userEvent.type(combobox, 'Bul');
      });

      expect(onOpenChange).toHaveBeenCalled();
    });

    it('can be controlled', function () {
      let {getByRole} = renderComboBox({inputValue: 'blah'});

      let combobox = getByRole('combobox');
      expect(combobox.value).toBe('blah');

      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'a');
      });

      expect(combobox.value).toBe('blah');
      expect(onInputChange).toBeCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('blaha');
    });

    it('can select by mouse', function () {
      let onSelectionChange = jest.fn();
      let {getByRole} = render(
        <Provider theme={theme}>
          <ComboBox label="Test" onFilter={onFilter} onOpenChange={onOpenChange} onSelectionChange={onSelectionChange}>
            <Item key="1">Cheer</Item>
            <Item key="2">Cheerio</Item>
            <Item key="3">Cheeriest</Item>
          </ComboBox>
        </Provider>
      );

      let combobox = getByRole('combobox');

      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'Che');
        jest.runAllTimers();
      });

      expect(onOpenChange).toHaveBeenCalled();

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      act(() => {
        triggerPress(items[1]);
        jest.runAllTimers();
      });
      expect(onSelectionChange).toHaveBeenCalledWith('2');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
    });

    it('filters combobox items using contains strategy', function () {
      let {getByRole} = renderComboBox();

      let combobox = getByRole('combobox');
      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'o');
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(combobox).toHaveAttribute('aria-controls', listbox.id);

      let items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent('One');
      expect(items[1]).toHaveTextContent('Two');
    });

    it('calls onFilter', () => {
      let customFilterItems = [
        {name: 'The first item', id: '1'},
        {name: 'The second item', id: '2'},
        {name: 'The third item', id: '3'}
      ];

      let CustomFilterComboBox = () => {
        let [list, setList] = React.useState(customFilterItems);

        let onFilter = (value) => {
          setList(customFilterItems.filter(item => item.name.includes(value)));
        };

        return (
          <ComboBox items={list} label="Combobox" onFilter={onFilter}>
            {(item) => <Item>{item.name}</Item>}
          </ComboBox>
        );
      };
      let {getByRole} = render(
        <Provider theme={theme}>
          <CustomFilterComboBox />
        </Provider>
      );

      let combobox = getByRole('combobox');
      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'second');
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(1);
    });

    it('doesn\'t focus the first item in combobox menu if you completely clear your textfield', function () {
      let {getByRole} = renderComboBox();

      let combobox = getByRole('combobox');
      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'o');
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();

      let items = within(listbox).getAllByRole('option');
      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      listbox = getByRole('listbox');
      items = within(listbox).getAllByRole('option');
      expect(listbox).toBeVisible();
      expect(items).toHaveLength(3);
      expect(combobox).not.toHaveAttribute('aria-activedescendant');
    });

    it('clears prior item focus when input no longer matches existing value if allowsCustomValue is true', function () {
      let {getByRole} = renderComboBox({allowsCustomValue: true});
      let combobox = getByRole('combobox');
      // Change input value to something matching a combobox value
      act(() => {
        combobox.focus();
        fireEvent.change(combobox, {target: {value: 'Two'}});
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      let items = within(listbox).getAllByRole('option');
      expect(listbox).toBeVisible();
      expect(items).toHaveLength(1);
      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);
      expect(items[0].textContent).toBe('Two');

      // Change input text to something that doesn't match any combobox items but still shows the menu
      act(() => {
        combobox.focus();
        fireEvent.change(combobox, {target: {value: 'Tw'}});
        jest.runAllTimers();
      });

      // check that no item is focused in the menu
      listbox = getByRole('listbox');
      items = within(listbox).getAllByRole('option');
      expect(listbox).toBeVisible();
      expect(items).toHaveLength(1);
      expect(combobox).not.toHaveAttribute('aria-activedescendant');
      expect(items[0].textContent).toBe('Two');
    });
  });

  describe('blur', function () {
    it('closes', function () {
      let {queryByRole, getAllByRole} = render(
        <Provider theme={theme}>
          <ComboBox label="Test" onOpenChange={onOpenChange} onInputChange={onInputChange} onSelectionChange={onSelectionChange}>
            <Item key="1">Bulbasaur</Item>
            <Item key="2">Squirtle</Item>
            <Item key="3">Charmander</Item>
          </ComboBox>
          <Button variant="secondary">Focus move</Button>
        </Provider>
      );

      let button = getAllByRole('button')[0];
      let secondaryButton = getAllByRole('button')[1];
      act(() => {
        userEvent.click(button);
        jest.runAllTimers();
        userEvent.tab();
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(secondaryButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onSelectionChange).toHaveBeenCalledWith('1');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('Bulbasaur');
      expect(queryByRole('listbox')).toBeFalsy();
    });

    it('closes and commits custom value', function () {
      let onCustomValue = jest.fn();
      let {getByRole, getAllByRole} = render(
        <Provider theme={theme}>
          <ComboBox label="Test" allowsCustomValue onOpenChange={onOpenChange} onSelectionChange={onSelectionChange} onCustomValue={onCustomValue}>
            <Item key="1">Bulbasaur</Item>
            <Item key="2">Squirtle</Item>
            <Item key="3">Charmander</Item>
          </ComboBox>
          <Button variant="secondary">Focus move</Button>
        </Provider>
      );

      let combobox = getByRole('combobox');
      let secondaryButton = getAllByRole('button')[1];
      expect(onCustomValue).not.toHaveBeenCalled();
      act(() => {
        userEvent.click(combobox);
        jest.runAllTimers();
        userEvent.type(combobox, 'Bulba');
        jest.runAllTimers();
        userEvent.tab();
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(secondaryButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onCustomValue).toHaveBeenCalledTimes(1);
      expect(onCustomValue).toHaveBeenCalledWith('Bulba');

      expect(() => getByRole('listbox')).toThrow();
    });

    it('closes and doesn\'t commit custom value if a actual menu item is focused', function () {
      let {getByRole, getAllByRole} = render(
        <Provider theme={theme}>
          <ComboBox label="Test" allowsCustomValue onOpenChange={onOpenChange} onSelectionChange={onSelectionChange} onCustomValue={onCustomValue}>
            <Item key="1">Bulbasaur</Item>
            <Item key="2">Squirtle</Item>
            <Item key="3">Charmander</Item>
          </ComboBox>
          <Button variant="secondary">Focus move</Button>
        </Provider>
      );

      let combobox = getByRole('combobox');
      let secondaryButton = getAllByRole('button')[1];

      expect(onCustomValue).not.toHaveBeenCalled();
      act(() => {
        userEvent.click(combobox);
        jest.runAllTimers();
        userEvent.type(combobox, 'Charm');
        jest.runAllTimers();
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');

      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);

      act(() => {
        jest.runAllTimers();
        userEvent.tab();
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(secondaryButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onCustomValue).not.toHaveBeenCalled();
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith('3');

      expect(() => getByRole('listbox')).toThrow();
    });

    it('clears the input field if value doesn\'t match a combobox option and no item is focused (menuTrigger=manual case)', function () {
      let {getByRole, getAllByRole} = render(
        <Provider theme={theme}>
          <ComboBox label="Test" menuTrigger="manual" onOpenChange={onOpenChange} onSelectionChange={onSelectionChange} onCustomValue={onCustomValue} onInputChange={onInputChange}>
            <Item key="1">Bulbasaur</Item>
            <Item key="2">Squirtle</Item>
            <Item key="3">Charmander</Item>
          </ComboBox>
          <Button variant="secondary">Focus move</Button>
        </Provider>
      );

      let combobox = getByRole('combobox');
      let secondaryButton = getAllByRole('button')[1];

      expect(onCustomValue).not.toHaveBeenCalled();
      act(() => {
        userEvent.click(combobox);
        userEvent.type(combobox, 'Charm');
        jest.runAllTimers();
      });

      expect(() => getByRole('listbox')).toThrow();
      expect(combobox.value).toBe('Charm');

      act(() => {
        userEvent.tab();
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(secondaryButton);
      expect(onCustomValue).not.toHaveBeenCalled();
      expect(onSelectionChange).not.toHaveBeenCalled();
      expect(onInputChange).toHaveBeenCalledWith('');
      expect(combobox.value).toBe('');
    });

    it('propagates blur event outside of the component', function () {
      let {getByRole} = render(
        <Provider theme={theme}>
          <div onBlur={outerBlur}>
            <ComboBox label="Test" autoFocus onBlur={onBlur}>
              <Item key="1">Bulbasaur</Item>
              <Item key="2">Squirtle</Item>
              <Item key="3">Charmander</Item>
            </ComboBox>
            <Button variant="primary">Second focus</Button>
          </div>
        </Provider>
      );

      let combobox = getByRole('combobox');
      expect(document.activeElement).toBe(combobox);

      expect(onBlur).toHaveBeenCalledTimes(0);
      expect(outerBlur).toHaveBeenCalledTimes(0);

      act(() => {
        userEvent.tab();
      });

      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(outerBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('clears selection', function () {
    it('if user deletes all text in input (uncontrolled)', function () {
      let {getByRole} = renderComboBox();

      let combobox = getByRole('combobox');
      let button = getByRole('button');
      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'o');
        jest.runAllTimers();
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(combobox).toHaveAttribute('aria-activedescendant', items[1].id);

      act(() => {
        fireEvent.keyDown(combobox, {key: 'Enter', code: 13, charCode: 13});
        jest.runAllTimers();
        triggerPress(button);
        jest.runAllTimers();
      });

      listbox = getByRole('listbox');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith('2');
      items = within(listbox).getAllByRole('option');
      expect(items[0]).toHaveTextContent('Two');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);
      listbox = getByRole('listbox');
      items = within(listbox).getAllByRole('option');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[1]).not.toHaveAttribute('aria-selected', 'true');
    });

    it('doesn\'t happen if user deletes all text in input (controlled)', function () {
      let {getByRole} = renderComboBox({selectedKey: '2'});

      let combobox = getByRole('combobox');
      act(() => {
        combobox.focus();
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(items[0]).toHaveTextContent('Two');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);

      listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      items = within(listbox).getAllByRole('option');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[1]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('controlled combobox', function () {
    it('supports selectedKey and inputValue (matching)', function () {
      let {getByRole} = renderComboBox({selectedKey: '2', inputValue: 'Two'});
      let combobox = getByRole('combobox');

      expect(combobox.value).toBe('Two');

      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'A');
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('Two');
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('TwoA');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(items[0]).toHaveTextContent('Two');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('supports selectedKey and inputValue (not matching should error)', function () {
      // TODO by Dan, fill this in when I confirm how the error should work
    });

    it('supports selectedKey and defaultInputValue (controlled by selectedKey)', function () {
      let {getByRole} = renderComboBox({selectedKey: '2', defaultInputValue: 'Blah'});
      let combobox = getByRole('combobox');

      expect(combobox.value).toBe('Two');

      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'A');
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('TwoA');
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('TwoA');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('');
      expect(onInputChange).toHaveBeenCalledTimes(2);
      expect(onInputChange).toHaveBeenCalledWith('');
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[1]).toHaveAttribute('aria-selected', 'true');

      act(() => {
        triggerPress(items[0]);
        jest.runAllTimers();
      });

      expect(() => getByRole('listbox')).toThrow();
      expect(onInputChange).toHaveBeenCalledTimes(3);
      expect(onInputChange).toHaveBeenCalledWith('One');
      expect(onSelectionChange).toHaveBeenCalledTimes(3);
      expect(onSelectionChange).toHaveBeenCalledWith('1');

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      items = within(listbox).getAllByRole('option');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[1]).toHaveAttribute('aria-selected', 'true');
      expect(items[0]).toHaveTextContent('One');
      expect(items[0]).not.toHaveAttribute('aria-selected', 'true');
    });

    it('supports defaultSelectedKey and inputValue (controlled by inputValue)', function () {
      let {getByRole} = renderComboBox({defaultSelectedKey: '1', inputValue: 'Two'});
      let combobox = getByRole('combobox');

      expect(combobox.value).toBe('Two');

      act(() => {
        combobox.focus();
        userEvent.type(combobox, 'A');
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('Two');
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('TwoA');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);

      act(() => {
        fireEvent.change(combobox, {target: {value: 'One'}});
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('Two');
      expect(onInputChange).toHaveBeenCalledTimes(2);
      expect(onInputChange).toHaveBeenCalledWith('One');
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenCalledWith('1');

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(items[0]).toHaveTextContent('Two');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');
    });

    // Add tests for programtically changing the selectedKey/inputValue props?
  });

  describe('uncontrolled combobox', function () {
    it('supports defaultSelectedKey and defaultValue (matching)', function () {
      let {getByRole} = renderComboBox({defaultSelectedKey: '2', defaultInputValue: 'Two'});
      let combobox = getByRole('combobox');
      let button = getByRole('button');
      expect(combobox.value).toBe('Two');

      act(() => {
        combobox.focus();
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('Two');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');

      act(() => {
        userEvent.type(combobox, 'A');
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('TwoA');
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('TwoA');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('');
      expect(onInputChange).toHaveBeenCalledTimes(2);
      expect(onInputChange).toHaveBeenCalledWith('');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);

      listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      items = within(listbox).getAllByRole('option');
      expect(items[1]).toHaveTextContent('Two');
      expect(items[1]).not.toHaveAttribute('aria-selected', 'true');

      act(() => {
        triggerPress(items[0]);
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('One');
      expect(() => getByRole('listbox')).toThrow();
      expect(onInputChange).toHaveBeenCalledTimes(3);
      expect(onInputChange).toHaveBeenCalledWith('One');
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenCalledWith('1');

      act(() => {
        triggerPress(button);
        jest.runAllTimers();
      });

      listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      items = within(listbox).getAllByRole('option');
      expect(items[0]).toHaveTextContent('One');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('supports defaultSelectedKey and defaultValue (not matching, prioritizes defaultValue)', function () {
      let {getByRole} = renderComboBox({defaultSelectedKey: '2', defaultInputValue: 'One'});
      let combobox = getByRole('combobox');
      let button = getByRole('button');
      expect(combobox.value).toBe('One');

      act(() => {
        combobox.focus();
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('One');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('test behavior for only defaultInputValue', function () {
      let {getByRole} = renderComboBox({defaultInputValue: 'Two'});
      let combobox = getByRole('combobox');
      let button = getByRole('button');
      expect(combobox.value).toBe('Two');

      act(() => {
        combobox.focus();
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('Two');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('');
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);

      listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(3);
      expect(items[1]).toHaveTextContent('Two');
      expect(items[1]).not.toHaveAttribute('aria-selected', 'true');
    });

    it('test behavior for only defaultSelectedKey', function () {
      let {getByRole} = renderComboBox({defaultSelectedKey: '2'});
      let combobox = getByRole('combobox');
      let button = getByRole('button');
      expect(combobox.value).toBe('Two');

      act(() => {
        combobox.focus();
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      let items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('Two');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');

      act(() => {
        fireEvent.change(combobox, {target: {value: ''}});
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('');
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(undefined);

      listbox = getByRole('listbox');
      expect(listbox).toBeVisible();
      items = within(listbox).getAllByRole('option');
      expect(items).toHaveLength(3);
      expect(items[1]).toHaveTextContent('Two');
      expect(items[1]).not.toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('combobox with sections', function () {
    it('supports rendering sections', function () {
      let {getByRole, getByText} = renderSectionComboBox();

      let combobox = getByRole('combobox');
      let button = getByRole('button');
      act(() => {
        combobox.focus();
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();

      let items = within(listbox).getAllByRole('option');
      let groups = within(listbox).getAllByRole('group');
      expect(items).toHaveLength(6);
      expect(groups).toHaveLength(2);
      expect(groups[0]).toHaveAttribute('aria-labelledby', getByText('Section One').id);
      expect(getByText('Section One')).toHaveAttribute('aria-hidden', 'true');
      expect(groups[1]).toHaveAttribute('aria-labelledby', getByText('Section Two').id);
      expect(getByText('Section Two')).toHaveAttribute('aria-hidden', 'true');
      expect(document.activeElement).toBe(combobox);
      expect(combobox).toHaveAttribute('aria-activedescendant', items[0].id);

      expect(items[0]).toHaveAttribute('aria-labelledby', within(items[0]).getByText('One').id);
      expect(groups[0]).toContainElement(items[0]);
      expect(items[1]).toHaveAttribute('aria-labelledby', within(items[1]).getByText('Two').id);
      expect(groups[0]).toContainElement(items[1]);
      expect(items[2]).toHaveAttribute('aria-labelledby', within(items[2]).getByText('Three').id);
      expect(groups[0]).toContainElement(items[2]);
      expect(items[3]).toHaveAttribute('aria-labelledby', within(items[3]).getByText('Four').id);
      expect(groups[1]).toContainElement(items[3]);
      expect(items[4]).toHaveAttribute('aria-labelledby', within(items[4]).getByText('Five').id);
      expect(groups[1]).toContainElement(items[4]);
      expect(items[5]).toHaveAttribute('aria-labelledby', within(items[5]).getByText('Six').id);
      expect(groups[1]).toContainElement(items[5]);

      act(() => {
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
        jest.runAllTimers();
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
        jest.runAllTimers();
        fireEvent.keyDown(combobox, {key: 'ArrowDown', code: 40, charCode: 40});
        jest.runAllTimers();
      });

      expect(combobox).toHaveAttribute('aria-activedescendant', items[3].id);

      act(() => {
        fireEvent.keyDown(combobox, {key: 'Enter', code: 13, charCode: 13});
        jest.runAllTimers();
      });

      expect(combobox.value).toBe('Four');
      expect(() => getByRole('listbox')).toThrow();
      expect(onInputChange).toHaveBeenCalledTimes(1);
      expect(onInputChange).toHaveBeenCalledWith('Four');
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith('4');

      act(() => {
        triggerPress(button);
        jest.runAllTimers();
      });

      listbox = getByRole('listbox');
      expect(listbox).toBeVisible();

      items = within(listbox).getAllByRole('option');
      groups = within(listbox).getAllByRole('group');
      expect(items).toHaveLength(1);
      expect(groups).toHaveLength(1);
      expect(items[0]).toHaveTextContent('Four');
      expect(items[0]).toHaveAttribute('aria-selected', 'true');
      expect(groups[0]).toContainElement(items[0]);
      expect(groups[0]).toHaveAttribute('aria-labelledby', getByText('Section Two').id);
      expect(() => getByText('Section One')).toThrow();
    });

    it('sections are not valid selectable values', function () {
      let {getByRole} = renderSectionComboBox({selectedKey: 'section 1'});

      let combobox = getByRole('combobox');
      let button = getByRole('button');
      expect(combobox.value).toBe('');

      act(() => {
        triggerPress(button);
        jest.runAllTimers();
      });

      let listbox = getByRole('listbox');
      expect(listbox).toBeVisible();

      let groups = within(listbox).getAllByRole('group');
      expect(groups[0]).not.toHaveAttribute('aria-selected');

      expect(() => within(listbox).getAllByRole('img', {hidden: true})).toThrow();
    });
  });

  // TODO: write tests for isDisabled/isReadOnly/other storybook stories
});
