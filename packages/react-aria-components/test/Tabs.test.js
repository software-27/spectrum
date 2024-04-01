/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {act, fireEvent, pointerMap, render, within} from '@react-spectrum/test-utils';
import React from 'react';
import {Tab, TabList, TabPanel, Tabs} from '../';
import {TabsExample} from '../stories/Tabs.stories';
import userEvent from '@testing-library/user-event';

let renderTabs = (tabsProps, tablistProps, tabProps, tabpanelProps) => render(
  <Tabs {...tabsProps}>
    <TabList {...tablistProps} aria-label="Test">
      <Tab {...tabProps} id="a">A</Tab>
      <Tab {...tabProps} id="b">B</Tab>
      <Tab {...tabProps} id="c">C</Tab>
    </TabList>
    <TabPanel {...tabpanelProps} id="a">A</TabPanel>
    <TabPanel {...tabpanelProps} id="b">B</TabPanel>
    <TabPanel {...tabpanelProps} id="c">C</TabPanel>
  </Tabs>
);

describe('Tabs', () => {
  let user;
  beforeAll(() => {
    user = userEvent.setup({delay: null, pointerMap});
  });

  it('should render tabs with default classes', () => {
    let {getByRole, getAllByRole} = renderTabs();
    let tablist = getByRole('tablist');
    let tabs = tablist.closest('.react-aria-Tabs');
    expect(tabs).toBeInTheDocument();
    expect(tablist).toHaveAttribute('class', 'react-aria-TabList');
    expect(tablist).toHaveAttribute('aria-label', 'Test');

    for (let tab of getAllByRole('tab')) {
      expect(tab).toHaveAttribute('class', 'react-aria-Tab');
    }

    let tabpanel = getByRole('tabpanel');
    expect(tabpanel).toHaveAttribute('class', 'react-aria-TabPanel');
  });

  it('should render tabs with custom classes', () => {
    let {getByRole, getAllByRole} = renderTabs({className: 'tabs'}, {className: 'tablist'}, {className: 'tab'}, {className: 'tabpanel'});
    let tablist = getByRole('tablist');
    let tabs = tablist.closest('.tabs');
    expect(tabs).toBeInTheDocument();
    expect(tablist).toHaveAttribute('class', 'tablist');
    for (let tab of getAllByRole('tab')) {
      expect(tab).toHaveAttribute('class', 'tab');
    }

    let tabpanel = getByRole('tabpanel');
    expect(tabpanel).toHaveAttribute('class', 'tabpanel');
  });

  it('should support DOM props', () => {
    let {getByRole, getAllByRole} = renderTabs({'data-test': 'tabs'}, {'data-test': 'tablist'}, {'data-test': 'tab'}, {'data-test': 'tabpanel'});
    let tablist = getByRole('tablist');
    let tabs = tablist.closest('.react-aria-Tabs');
    expect(tabs).toHaveAttribute('data-test', 'tabs');
    expect(tablist).toHaveAttribute('data-test', 'tablist');
    for (let tab of getAllByRole('tab')) {
      expect(tab).toHaveAttribute('data-test', 'tab');
    }

    let tabpanel = getByRole('tabpanel');
    expect(tabpanel).toHaveAttribute('data-test', 'tabpanel');
  });

  it('should support aria props on the tabs', () => {
    let {getAllByRole} = renderTabs({}, {}, {
      'aria-label': 'label',
      'aria-labelledby': 'labelledby',
      'aria-describedby': 'describedby',
      'aria-details': 'details'
    }, {});
    for (let tab of getAllByRole('tab')) {
      expect(tab).toHaveAttribute('aria-label', 'label');
      expect(tab).toHaveAttribute('aria-labelledby', 'labelledby');
      expect(tab).toHaveAttribute('aria-describedby', 'describedby');
      expect(tab).toHaveAttribute('aria-details', 'details');
    }
  });

  it('should support render props', () => {
    let {getByRole} = render(
      <Tabs orientation="horizontal">
        {({orientation}) => (
          <>
            <TabList aria-label={`Test ${orientation}`}>
              <Tab id="a">A</Tab>
              <Tab id="b">B</Tab>
              <Tab id="c">C</Tab>
            </TabList>
            <TabPanel id="a">A</TabPanel>
            <TabPanel id="b">B</TabPanel>
            <TabPanel id="c">C</TabPanel>
          </>
        )}
      </Tabs>
    );
    let tablist = getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-label', 'Test horizontal');
  });

  it('should support hover', async () => {
    let {getAllByRole} = renderTabs({}, {}, {className: ({isHovered}) => isHovered ? 'hover' : ''});
    let tab = getAllByRole('tab')[0];

    expect(tab).not.toHaveAttribute('data-hovered');
    expect(tab).not.toHaveClass('hover');

    await user.hover(tab);
    expect(tab).toHaveAttribute('data-hovered', 'true');
    expect(tab).toHaveClass('hover');

    await user.unhover(tab);
    expect(tab).not.toHaveAttribute('data-hovered');
    expect(tab).not.toHaveClass('hover');
  });

  it('should support focus ring', async () => {
    let {getAllByRole} = renderTabs({}, {}, {className: ({isFocusVisible}) => isFocusVisible ? 'focus' : ''});
    let tab = getAllByRole('tab')[0];

    expect(tab).not.toHaveAttribute('data-focus-visible');
    expect(tab).not.toHaveClass('focus');

    await user.tab();
    expect(document.activeElement).toBe(tab);
    expect(tab).toHaveAttribute('data-focus-visible', 'true');
    expect(tab).toHaveAttribute('data-focused', 'true');
    expect(tab).toHaveClass('focus');

    await user.tab();
    expect(tab).not.toHaveAttribute('data-focus-visible');
    expect(tab).not.toHaveClass('focus');
  });

  it('should support press state', () => {
    let {getAllByRole} = renderTabs({}, {}, {className: ({isPressed}) => isPressed ? 'pressed' : ''});
    let tab = getAllByRole('tab')[0];

    expect(tab).not.toHaveAttribute('data-pressed');
    expect(tab).not.toHaveClass('pressed');

    fireEvent.mouseDown(tab);
    expect(tab).toHaveAttribute('data-pressed', 'true');
    expect(tab).toHaveClass('pressed');

    fireEvent.mouseUp(tab);
    expect(tab).not.toHaveAttribute('data-pressed');
    expect(tab).not.toHaveClass('pressed');
  });

  it('should support disabled state on all tabs', () => {
    let {getAllByRole} = renderTabs({isDisabled: true}, {}, {className: ({isDisabled}) => isDisabled ? 'disabled' : ''});
    let tab = getAllByRole('tab')[0];

    expect(tab).toHaveAttribute('aria-disabled', 'true');
    expect(tab).toHaveClass('disabled');
  });

  it('should support disabled state on tab', () => {
    let className = ({isDisabled}) => isDisabled ? 'disabled' : '';
    let {getAllByRole} = renderTabs({disabledKeys: ['a']}, {className}, {className});
    let tab = getAllByRole('tab')[0];

    expect(tab).toHaveAttribute('aria-disabled', 'true');
    expect(tab).toHaveClass('disabled');
  });

  it('should support isDisabled prop on tab', async () => {
    let {getAllByRole} = render(
      <Tabs>
        <TabList aria-label="Test">
          <Tab id="a">A</Tab>
          <Tab id="b" isDisabled>B</Tab>
          <Tab id="c">C</Tab>
        </TabList>
        <TabPanel id="a">A</TabPanel>
        <TabPanel id="b">B</TabPanel>
        <TabPanel id="c">C</TabPanel>
      </Tabs>
    );
    let items = getAllByRole('tab');
    expect(items[1]).toHaveAttribute('aria-disabled', 'true');

    await user.tab();
    expect(document.activeElement).toBe(items[0]);
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(items[2]);
  });

  it('should support selected state', async () => {
    let onSelectionChange = jest.fn();
    let {getAllByRole} = renderTabs({onSelectionChange}, {}, {className: ({isSelected}) => isSelected ? 'selected' : ''});
    let tabs = getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveClass('selected');

    await user.click(tabs[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith('b');
    expect(tabs[0]).not.toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).not.toHaveClass('selected');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveClass('selected');

    await user.click(tabs[0]);
    expect(onSelectionChange).toHaveBeenLastCalledWith('a');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveClass('selected');
  });

  it('should update TabPanel ID when current tab is changed', async () => {
    let onSelectionChange = jest.fn();
    let {getByRole, getAllByRole} = render(
      <Tabs onSelectionChange={onSelectionChange}>
        <TabList>
          <Tab id="first-element">First</Tab>
          <Tab id="second-element">Second</Tab>
          <Tab id="third-element">Third</Tab>
        </TabList>
        <TabPanel id="first-element">First</TabPanel>
        <TabPanel id="second-element">Second</TabPanel>
        <TabPanel id="third-element">Third</TabPanel>
      </Tabs>
    );

    expect(getByRole('tabpanel').getAttribute('id')).toContain('first-element');
    let tabs = getAllByRole('tab');

    await user.click(tabs[1]);
    expect(onSelectionChange).toHaveBeenCalled();
    expect(getByRole('tabpanel').getAttribute('id')).toContain('second-element');

    await user.click(tabs[2]);
    expect(onSelectionChange).toHaveBeenCalled();
    expect(getByRole('tabpanel').getAttribute('id')).toContain('third-element');

  });

  it('should support orientation', () => {
    let className = ({orientation}) => orientation;
    let {getByRole} = renderTabs({orientation: 'vertical', className}, {className});
    let tablist = getByRole('tablist');
    let tabs = tablist.parentElement;

    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    expect(tablist).toHaveClass('vertical');

    expect(tabs).toHaveAttribute('data-orientation', 'vertical');
    expect(tabs).toHaveClass('vertical');
  });

  it('should support refs', () => {
    let tabsRef = React.createRef();
    let tabListRef = React.createRef();
    let tabRef = React.createRef();
    let tabPanelRef = React.createRef();
    render(
      <Tabs ref={tabsRef}>
        <TabList ref={tabListRef}>
          <Tab id="a" ref={tabRef}>A</Tab>
          <Tab id="b">B</Tab>
          <Tab id="c">C</Tab>
        </TabList>
        <TabPanel id="a" ref={tabPanelRef}>A</TabPanel>
        <TabPanel id="b">B</TabPanel>
        <TabPanel id="c">C</TabPanel>
      </Tabs>
    );
    expect(tabsRef.current).toBeInstanceOf(HTMLElement);
    expect(tabListRef.current).toBeInstanceOf(HTMLElement);
    expect(tabRef.current).toBeInstanceOf(HTMLElement);
    expect(tabPanelRef.current).toBeInstanceOf(HTMLElement);
  });

  it('should support shouldForceMount', async () => {
    // Mock console.error for React Canary "Received the string `true` for the boolean attribute `inert`." warning
    // In current React 18 version (18.1.0), the opposite error is thrown where it expects a non-boolean value for the same `inert` attribute
    const consoleError = console.error;
    console.error = jest.fn();

    let {getAllByRole} = renderTabs({}, {}, {}, {shouldForceMount: true});
    let tabpanels = document.querySelectorAll('.react-aria-TabPanel');
    expect(tabpanels).toHaveLength(3);
    expect(tabpanels[0]).not.toHaveAttribute('inert');
    expect(tabpanels[1]).toHaveAttribute('inert');
    expect(tabpanels[2]).toHaveAttribute('inert');

    let tabs = getAllByRole('tab');
    await user.click(tabs[1]);

    expect(tabpanels[0]).toHaveAttribute('inert');
    expect(tabpanels[1]).not.toHaveAttribute('inert');
    expect(tabpanels[2]).toHaveAttribute('inert');
    console.error = consoleError;
  });

  it('should support keyboardActivation=manual', () => {
    let onSelectionChange = jest.fn();
    let {getByRole} = renderTabs({keyboardActivation: 'manual', onSelectionChange, defaultSelectedKey: 'a'});

    let tablist = getByRole('tablist');
    let tabs = within(tablist).getAllByRole('tab');
    let firstItem = tabs[0];
    let secondItem = tabs[1];
    let thirdItem = tabs[2];
    act(() => {firstItem.focus();});
    expect(firstItem).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(firstItem, {key: 'ArrowRight', code: 39, charCode: 39});
    fireEvent.keyUp(document.activeElement, {key: 'ArrowRight', code: 39, charCode: 39});
    expect(secondItem).toHaveAttribute('aria-selected', 'false');
    expect(document.activeElement).toBe(secondItem);
    fireEvent.keyDown(secondItem, {key: 'ArrowRight', code: 39, charCode: 39});
    fireEvent.keyUp(document.activeElement, {key: 'ArrowRight', code: 39, charCode: 39});
    expect(thirdItem).toHaveAttribute('aria-selected', 'false');
    expect(document.activeElement).toBe(thirdItem);
    fireEvent.keyDown(thirdItem, {key: 'Enter', code: 13, charCode: 13});
    fireEvent.keyUp(document.activeElement, {key: 'Enter', code: 13, charCode: 13});
    expect(firstItem).toHaveAttribute('aria-selected', 'false');
    expect(secondItem).toHaveAttribute('aria-selected', 'false');
    expect(thirdItem).toHaveAttribute('aria-selected', 'true');

    expect(onSelectionChange).toBeCalledTimes(1);
  });

  it('should support tabs as links', async function () {
    let {getAllByRole} = render(<TabsExample />);

    let tabs = getAllByRole('tab');
    expect(tabs[0].tagName).toBe('A');
    expect(tabs[0]).toHaveAttribute('href', '/FoR');
    expect(tabs[1].tagName).toBe('A');
    expect(tabs[1]).toHaveAttribute('href', '/MaR');
    expect(tabs[2].tagName).toBe('A');
    expect(tabs[2]).toHaveAttribute('href', '/Emp');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await user.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(tabs[1], {key: 'ArrowRight'});
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('should render tab with aria-label', () => {
    let {getAllByRole} = render(
      <Tabs>
        <TabList>
          <Tab id="a" aria-label="Tab A">A</Tab>
          <Tab id="b" aria-label="Tab B">B</Tab>
          <Tab id="c" aria-label="Tab C">C</Tab>
        </TabList>
        <TabPanel id="a">A</TabPanel>
        <TabPanel id="b">B</TabPanel>
        <TabPanel id="c">C</TabPanel>
      </Tabs>
    );

    let tabs = getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-label', 'Tab A');
    expect(tabs[1]).toHaveAttribute('aria-label', 'Tab B');
    expect(tabs[2]).toHaveAttribute('aria-label', 'Tab C');
  });
});
