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

import {act, fireEvent, mockClickDefault, pointerMap, render, within} from '@react-spectrum/test-utils';
import {Button, Header, Keyboard, Menu, MenuContext, MenuItem, MenuTrigger, Popover, Section, Separator, SubmenuTrigger, Text} from '../';
import React from 'react';
import userEvent from '@testing-library/user-event';

let TestMenu = ({menuProps, itemProps, hasSubmenu, hasNestedSubmenu}) => (
  <Menu aria-label="Test" {...menuProps}>
    <MenuItem {...itemProps} id="cat">Cat</MenuItem>
    <MenuItem {...itemProps} id="dog">Dog</MenuItem>
    <MenuItem {...itemProps} id="kangaroo">Kangaroo</MenuItem>
    {hasSubmenu && (
      <SubmenuTrigger>
        <MenuItem {...itemProps} id="submenu-trigger">Submenu Trigger</MenuItem>
        <Popover>
          <Menu>
            <MenuItem {...itemProps} id="submenu-item-1">Submenu Item 1</MenuItem>
            <MenuItem {...itemProps} id="submenu-item-2">Submenu Item 2</MenuItem>
            <MenuItem {...itemProps} id="submenu-item-3">Submenu Item 3</MenuItem>
            {hasNestedSubmenu && (
              <SubmenuTrigger>
                <MenuItem {...itemProps} id="nested-submenu-trigger">Nested Submenu Trigger</MenuItem>
                <Popover>
                  <Menu>
                    <MenuItem {...itemProps} id="nested-submenu-item-1">Nested Submenu Item 1</MenuItem>
                    <MenuItem {...itemProps} id="nested-submenu-item-2">Nested Submenu Item 2</MenuItem>
                    <MenuItem {...itemProps} id="nested-submenu-item-3">Nested Submenu Item 3</MenuItem>
                  </Menu>
                </Popover>
              </SubmenuTrigger>
            )}
          </Menu>
        </Popover>
      </SubmenuTrigger>
    )}
  </Menu>
);

let renderMenu = (menuProps, itemProps) => render(<TestMenu {...{menuProps, itemProps}} />);

describe('Menu', () => {
  let user;
  beforeAll(() => {
    user = userEvent.setup({delay: null, pointerMap});
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {jest.runAllTimers();});
  });

  it('should render with default classes', () => {
    let {getByRole, getAllByRole} = renderMenu();
    let menu = getByRole('menu');
    expect(menu).toHaveAttribute('class', 'react-aria-Menu');

    for (let menuitem of getAllByRole('menuitem')) {
      expect(menuitem).toHaveAttribute('class', 'react-aria-MenuItem');
    }
  });

  it('should render with custom classes', () => {
    let {getByRole, getAllByRole} = renderMenu({className: 'menu'}, {className: 'item'});
    let menu = getByRole('menu');
    expect(menu).toHaveAttribute('class', 'menu');

    for (let menuitem of getAllByRole('menuitem')) {
      expect(menuitem).toHaveAttribute('class', 'item');
    }
  });

  it('should support DOM props', () => {
    let {getByRole, getAllByRole} = renderMenu({'data-foo': 'bar'}, {'data-bar': 'foo'});
    let menu = getByRole('menu');
    expect(menu).toHaveAttribute('data-foo', 'bar');

    for (let menuitem of getAllByRole('menuitem')) {
      expect(menuitem).toHaveAttribute('data-bar', 'foo');
    }
  });

  it('should support aria-label on the menu items', () => {
    let {getAllByRole} = renderMenu({}, {'aria-label': 'test'});

    for (let menuitem of getAllByRole('menuitem')) {
      expect(menuitem).toHaveAttribute('aria-label', 'test');
    }
  });

  it('should support the slot prop', () => {
    let {getByRole} = render(
      <MenuContext.Provider value={{slots: {test: {'aria-label': 'test'}}}}>
        <TestMenu menuProps={{slot: 'test', 'aria-label': undefined}} />
      </MenuContext.Provider>
    );

    let menu = getByRole('menu');
    expect(menu).toHaveAttribute('slot', 'test');
    expect(menu).toHaveAttribute('aria-label', 'test');
  });

  it('should support refs', () => {
    let listBoxRef = React.createRef();
    let sectionRef = React.createRef();
    let itemRef = React.createRef();
    render(
      <Menu aria-label="Test" ref={listBoxRef}>
        <Section ref={sectionRef}>
          <MenuItem ref={itemRef}>Cat</MenuItem>
        </Section>
      </Menu>
    );
    expect(listBoxRef.current).toBeInstanceOf(HTMLElement);
    expect(sectionRef.current).toBeInstanceOf(HTMLElement);
    expect(itemRef.current).toBeInstanceOf(HTMLElement);
  });

  it('should support slots', () => {
    let {getByRole} = render(
      <Menu aria-label="Actions">
        <MenuItem textValue="Copy">
          <Text slot="label">Copy</Text>
          <Text slot="description">Copy the selected text</Text>
          <Keyboard>⌘C</Keyboard>
        </MenuItem>
      </Menu>
    );

    let menuitem = getByRole('menuitem');
    expect(menuitem).toHaveAttribute('aria-labelledby');
    expect(document.getElementById(menuitem.getAttribute('aria-labelledby'))).toHaveTextContent('Copy');
    expect(menuitem).toHaveAttribute('aria-describedby');
    expect(menuitem.getAttribute('aria-describedby').split(' ').map(o => document.getElementById(o).textContent).join(' ')).toBe('Copy the selected text ⌘C');
  });

  it('should support separators', () => {
    let {getByRole} = render(
      <Menu aria-label="Actions">
        <MenuItem>Foo</MenuItem>
        <Separator />
        <MenuItem>Bar</MenuItem>
      </Menu>
    );

    let separator = getByRole('separator');
    expect(separator).toHaveClass('react-aria-Separator');
  });

  it('should support separators with custom class names', () => {
    let {getByRole} = render(
      <Menu aria-label="Actions">
        <MenuItem>Foo</MenuItem>
        <Separator className="my-separator" />
        <MenuItem>Bar</MenuItem>
      </Menu>
    );

    let separator = getByRole('separator');
    expect(separator).toHaveClass('my-separator');
  });

  it('should support sections', () => {
    let {getAllByRole} = render(
      <Menu aria-label="Sandwich contents" selectionMode="multiple">
        <Section>
          <Header>Veggies</Header>
          <MenuItem id="lettuce">Lettuce</MenuItem>
          <MenuItem id="tomato">Tomato</MenuItem>
          <MenuItem id="onion">Onion</MenuItem>
        </Section>
        <Section>
          <Header>Protein</Header>
          <MenuItem id="ham">Ham</MenuItem>
          <MenuItem id="tuna">Tuna</MenuItem>
          <MenuItem id="tofu">Tofu</MenuItem>
        </Section>
      </Menu>
    );

    let groups = getAllByRole('group');
    expect(groups).toHaveLength(2);

    expect(groups[0]).toHaveClass('react-aria-Section');
    expect(groups[1]).toHaveClass('react-aria-Section');

    expect(groups[0]).toHaveAttribute('aria-labelledby');
    expect(document.getElementById(groups[0].getAttribute('aria-labelledby'))).toHaveTextContent('Veggies');
  });

  it('should support dynamic collections', () => {
    let items = [
      {id: 'cat', name: 'Cat'},
      {id: 'dog', name: 'Dog'}
    ];

    let {getAllByRole} = render(
      <Menu aria-label="Test" items={items}>
        {(item) => <MenuItem id={item.id}>{item.name}</MenuItem>}
      </Menu>
    );

    expect(getAllByRole('menuitem').map((it) => it.textContent)).toEqual(['Cat', 'Dog']);
  });

  it('should support focus ring', async () => {
    let {getAllByRole} = renderMenu({}, {className: ({isFocusVisible}) => isFocusVisible ? 'focus' : ''});
    let menuitem = getAllByRole('menuitem')[0];

    expect(menuitem).not.toHaveAttribute('data-focus-visible');
    expect(menuitem).not.toHaveClass('focus');

    await user.tab();
    expect(document.activeElement).toBe(menuitem);
    expect(menuitem).toHaveAttribute('data-focus-visible', 'true');
    expect(menuitem).toHaveClass('focus');

    fireEvent.keyDown(menuitem, {key: 'ArrowDown'});
    fireEvent.keyUp(menuitem, {key: 'ArrowDown'});
    expect(menuitem).not.toHaveAttribute('data-focus-visible');
    expect(menuitem).not.toHaveClass('focus');
  });

  it('should support press state', () => {
    let {getAllByRole} = renderMenu({}, {className: ({isPressed}) => isPressed ? 'pressed' : ''});
    let menuitem = getAllByRole('menuitem')[0];

    expect(menuitem).not.toHaveAttribute('data-pressed');
    expect(menuitem).not.toHaveClass('pressed');

    fireEvent.mouseDown(menuitem);
    expect(menuitem).toHaveAttribute('data-pressed', 'true');
    expect(menuitem).toHaveClass('pressed');

    fireEvent.mouseUp(menuitem);
    expect(menuitem).not.toHaveAttribute('data-pressed');
    expect(menuitem).not.toHaveClass('pressed');
  });

  it('should support selection state', async () => {
    let {getAllByRole} = renderMenu({selectionMode: 'multiple'}, {className: ({isSelected}) => isSelected ? 'selected' : ''});
    let menuitem = getAllByRole('menuitemcheckbox')[0];

    expect(menuitem).not.toHaveAttribute('aria-checked', 'true');
    expect(menuitem).not.toHaveClass('selected');

    await user.click(menuitem);
    expect(menuitem).toHaveAttribute('aria-checked', 'true');
    expect(menuitem).toHaveClass('selected');

    await user.click(menuitem);
    expect(menuitem).not.toHaveAttribute('aria-checked', 'true');
    expect(menuitem).not.toHaveClass('selected');
  });

  it('should support disabled state', () => {
    let {getAllByRole} = renderMenu({disabledKeys: ['cat']}, {className: ({isDisabled}) => isDisabled ? 'disabled' : ''});
    let menuitem = getAllByRole('menuitem')[0];

    expect(menuitem).toHaveAttribute('aria-disabled', 'true');
    expect(menuitem).toHaveClass('disabled');
  });

  it('should support isDisabled prop on items', async () => {
    let {getAllByRole} = render(
      <Menu aria-label="Test">
        <MenuItem id="cat">Cat</MenuItem>
        <MenuItem id="dog" isDisabled>Dog</MenuItem>
        <MenuItem id="kangaroo">Kangaroo</MenuItem>
      </Menu>
    );
    let items = getAllByRole('menuitem');
    expect(items[1]).toHaveAttribute('aria-disabled', 'true');

    await user.tab();
    expect(document.activeElement).toBe(items[0]);
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(items[2]);
  });

  it('should support onAction on items', async () => {
    let onAction = jest.fn();
    let {getAllByRole} = render(
      <Menu aria-label="Test">
        <MenuItem id="cat" onAction={onAction}>Cat</MenuItem>
        <MenuItem id="dog">Dog</MenuItem>
        <MenuItem id="kangaroo">Kangaroo</MenuItem>
      </Menu>
    );
    let items = getAllByRole('menuitem');
    await user.click(items[0]);
    expect(onAction).toHaveBeenCalled();
  });

  it('should support menu trigger', async () => {
    let onAction = jest.fn();
    let {getByRole, getAllByRole} = render(
      <MenuTrigger>
        <Button aria-label="Menu">☰</Button>
        <Popover>
          <Menu onAction={onAction}>
            <MenuItem id="open">Open</MenuItem>
            <MenuItem id="rename">Rename…</MenuItem>
            <MenuItem id="duplicate">Duplicate</MenuItem>
            <MenuItem id="share">Share…</MenuItem>
            <MenuItem id="delete">Delete…</MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    );

    let button = getByRole('button');
    expect(button).not.toHaveAttribute('data-pressed');

    await user.click(button);
    expect(button).toHaveAttribute('data-pressed');

    let menu = getByRole('menu');
    expect(getAllByRole('menuitem')).toHaveLength(5);

    let popover = menu.closest('.react-aria-Popover');
    expect(popover).toBeInTheDocument();
    expect(popover).toHaveAttribute('data-trigger', 'MenuTrigger');

    await user.click(getAllByRole('menuitem')[1]);
    expect(onAction).toHaveBeenLastCalledWith('rename');
  });

  it('should support onScroll', () => {
    let onScroll = jest.fn();
    let {getByRole} = renderMenu({onScroll});
    let menu = getByRole('menu');
    fireEvent.scroll(menu);
    expect(onScroll).toHaveBeenCalled();
  });

  describe('supports links', function () {
    describe.each(['mouse', 'keyboard'])('%s', (type) => {
      it.each(['none', 'single', 'multiple'])('with selectionMode = %s', async function (selectionMode) {
        let onAction = jest.fn();
        let onSelectionChange = jest.fn();
        let tree = render(
          <Menu aria-label="menu" selectionMode={selectionMode} onSelectionChange={onSelectionChange} onAction={onAction}>
            <MenuItem href="https://google.com">One</MenuItem>
            <MenuItem href="https://adobe.com">Two</MenuItem>
          </Menu>
        );

        let role = {
          none: 'menuitem',
          single: 'menuitemradio',
          multiple: 'menuitemcheckbox'
        }[selectionMode];
        let items = tree.getAllByRole(role);
        expect(items).toHaveLength(2);
        expect(items[0].tagName).toBe('A');
        expect(items[0]).toHaveAttribute('href', 'https://google.com');
        expect(items[1].tagName).toBe('A');
        expect(items[1]).toHaveAttribute('href', 'https://adobe.com');

        let onClick = mockClickDefault();
        if (type === 'mouse') {
          await user.click(items[1]);
        } else {
          fireEvent.keyDown(items[1], {key: 'Enter'});
          fireEvent.keyUp(items[1], {key: 'Enter'});
        }
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(onClick).toHaveBeenCalledTimes(1);
        document.removeEventListener('click', onClick);
      });
    });
  });

  describe('Submenus', function () {
    it('should support a submenu trigger', async () => {
      let onAction = jest.fn();
      let {getByRole, getAllByRole} = render(
        <MenuTrigger>
          <Button aria-label="Menu">☰</Button>
          <Popover>
            <Menu onAction={onAction}>
              <MenuItem id="open">Open</MenuItem>
              <MenuItem id="rename">Rename…</MenuItem>
              <MenuItem id="duplicate">Duplicate</MenuItem>
              <SubmenuTrigger>
                <MenuItem id="share">Share…</MenuItem>
                <Popover>
                  <Menu onAction={onAction}>
                    <MenuItem id="email">Email</MenuItem>
                    <MenuItem id="sms">SMS</MenuItem>
                    <MenuItem id="twitter">Twitter</MenuItem>
                  </Menu>
                </Popover>
              </SubmenuTrigger>
              <MenuItem id="delete">Delete…</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      );

      let button = getByRole('button');
      expect(button).not.toHaveAttribute('data-pressed');

      await user.click(button);
      expect(button).toHaveAttribute('data-pressed');

      let menu = getAllByRole('menu')[0];
      expect(getAllByRole('menuitem')).toHaveLength(5);

      let popover = menu.closest('.react-aria-Popover');
      expect(popover).toBeInTheDocument();
      expect(popover).toHaveAttribute('data-trigger', 'MenuTrigger');

      let triggerItem = getAllByRole('menuitem')[3];
      expect(triggerItem).toHaveTextContent('Share…');
      expect(triggerItem).toHaveAttribute('aria-haspopup', 'menu');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'false');
      expect(triggerItem).toHaveAttribute('data-has-submenu', 'true');
      expect(triggerItem).not.toHaveAttribute('data-open');

      // Open the submenu
      await user.pointer({target: triggerItem});
      act(() => {jest.runAllTimers();});
      expect(triggerItem).toHaveAttribute('data-hovered', 'true');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'true');
      expect(triggerItem).toHaveAttribute('data-open', 'true');
      let submenu = getAllByRole('menu')[1];
      expect(submenu).toBeInTheDocument();

      let submenuPopover = submenu.closest('.react-aria-Popover');
      expect(submenuPopover).toBeInTheDocument();
      expect(submenuPopover).toHaveAttribute('data-trigger', 'SubmenuTrigger');

      // Click a submenu item
      await user.click(getAllByRole('menuitem')[5]);
      expect(onAction).toHaveBeenLastCalledWith('email');
      expect(menu).not.toBeInTheDocument();
      expect(submenu).not.toBeInTheDocument();
    });
    it('should support nested submenu triggers', async () => {
      let onAction = jest.fn();
      let {getByRole, getAllByRole} = render(
        <MenuTrigger>
          <Button aria-label="Menu">☰</Button>
          <Popover>
            <Menu onAction={onAction}>
              <MenuItem id="open">Open</MenuItem>
              <MenuItem id="rename">Rename…</MenuItem>
              <MenuItem id="duplicate">Duplicate</MenuItem>
              <SubmenuTrigger>
                <MenuItem id="share">Share…</MenuItem>
                <Popover>
                  <Menu onAction={onAction}>
                    <SubmenuTrigger>
                      <MenuItem id="email">Email…</MenuItem>
                      <Popover>
                        <Menu onAction={onAction}>
                          <MenuItem id="work">Work</MenuItem>
                          <MenuItem id="personal">Personal</MenuItem>
                        </Menu>
                      </Popover>
                    </SubmenuTrigger>
                    <MenuItem id="sms">SMS</MenuItem>
                    <MenuItem id="twitter">Twitter</MenuItem>
                  </Menu>
                </Popover>
              </SubmenuTrigger>
              <MenuItem id="delete">Delete…</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      );

      let button = getByRole('button');
      expect(button).not.toHaveAttribute('data-pressed');

      await user.click(button);
      expect(button).toHaveAttribute('data-pressed');

      let menu = getAllByRole('menu')[0];
      expect(getAllByRole('menuitem')).toHaveLength(5);

      let popover = menu.closest('.react-aria-Popover');
      expect(popover).toBeInTheDocument();
      expect(popover).toHaveAttribute('data-trigger', 'MenuTrigger');

      let triggerItem = getAllByRole('menuitem')[3];
      expect(triggerItem).toHaveTextContent('Share…');
      expect(triggerItem).toHaveAttribute('aria-haspopup', 'menu');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'false');
      expect(triggerItem).toHaveAttribute('data-has-submenu', 'true');
      expect(triggerItem).not.toHaveAttribute('data-open');

      // Open the submenu
      await user.pointer({target: triggerItem});
      act(() => {jest.runAllTimers();});
      expect(triggerItem).toHaveAttribute('data-hovered', 'true');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'true');
      expect(triggerItem).toHaveAttribute('data-open', 'true');
      let submenu = getAllByRole('menu')[1];
      expect(submenu).toBeInTheDocument();

      let submenuPopover = submenu.closest('.react-aria-Popover');
      expect(submenuPopover).toBeInTheDocument();
      expect(submenuPopover).toHaveAttribute('data-trigger', 'SubmenuTrigger');

      let nestedTriggerItem = getAllByRole('menuitem')[5];
      expect(nestedTriggerItem).toHaveTextContent('Email…');
      expect(nestedTriggerItem).toHaveAttribute('aria-haspopup', 'menu');
      expect(nestedTriggerItem).toHaveAttribute('aria-expanded', 'false');
      expect(nestedTriggerItem).toHaveAttribute('data-has-submenu', 'true');
      expect(nestedTriggerItem).not.toHaveAttribute('data-open');

      // Open the nested submenu
      await user.pointer({target: nestedTriggerItem});
      act(() => {jest.runAllTimers();});
      expect(nestedTriggerItem).toHaveAttribute('data-hovered', 'true');
      expect(nestedTriggerItem).toHaveAttribute('aria-expanded', 'true');
      expect(nestedTriggerItem).toHaveAttribute('data-open', 'true');
      let nestedSubmenu = getAllByRole('menu')[1];
      expect(nestedSubmenu).toBeInTheDocument();

      let nestedSubmenuPopover = nestedSubmenu.closest('.react-aria-Popover');
      expect(nestedSubmenuPopover).toBeInTheDocument();
      expect(nestedSubmenuPopover).toHaveAttribute('data-trigger', 'SubmenuTrigger');

      // Click a nested submenu item
      await user.click(getAllByRole('menuitem')[8]);
      expect(onAction).toHaveBeenLastCalledWith('work');
      expect(nestedSubmenu).not.toBeInTheDocument();
      expect(submenu).not.toBeInTheDocument();
    });
    it('should close all submenus if interacting outside root submenu', async () => {
      let onAction = jest.fn();
      let {getByRole, getAllByRole, getByTestId} = render(
        <MenuTrigger>
          <Button aria-label="Menu">☰</Button>
          <Popover>
            <Menu onAction={onAction}>
              <MenuItem id="open">Open</MenuItem>
              <MenuItem id="rename">Rename…</MenuItem>
              <MenuItem id="duplicate">Duplicate</MenuItem>
              <SubmenuTrigger>
                <MenuItem id="share">Share…</MenuItem>
                <Popover>
                  <Menu onAction={onAction}>
                    <SubmenuTrigger>
                      <MenuItem id="email">Email…</MenuItem>
                      <Popover>
                        <Menu onAction={onAction}>
                          <MenuItem id="work">Work</MenuItem>
                          <MenuItem id="personal">Personal</MenuItem>
                        </Menu>
                      </Popover>
                    </SubmenuTrigger>
                    <MenuItem id="sms">SMS</MenuItem>
                    <MenuItem id="twitter">Twitter</MenuItem>
                  </Menu>
                </Popover>
              </SubmenuTrigger>
              <MenuItem id="delete">Delete…</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      );

      let button = getByRole('button');
      expect(button).not.toHaveAttribute('data-pressed');

      await user.click(button);
      expect(button).toHaveAttribute('data-pressed');

      let menu = getAllByRole('menu')[0];
      expect(getAllByRole('menuitem')).toHaveLength(5);

      let popover = menu.closest('.react-aria-Popover');
      expect(popover).toBeInTheDocument();
      expect(popover).toHaveAttribute('data-trigger', 'MenuTrigger');

      let triggerItem = getAllByRole('menuitem')[3];
      expect(triggerItem).toHaveTextContent('Share…');
      expect(triggerItem).toHaveAttribute('aria-haspopup', 'menu');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'false');
      expect(triggerItem).toHaveAttribute('data-has-submenu', 'true');
      expect(triggerItem).not.toHaveAttribute('data-open');

      // Open the submenu
      await user.pointer({target: triggerItem});
      act(() => {jest.runAllTimers();});
      expect(triggerItem).toHaveAttribute('data-hovered', 'true');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'true');
      expect(triggerItem).toHaveAttribute('data-open', 'true');
      let submenu = getAllByRole('menu')[1];
      expect(submenu).toBeInTheDocument();

      let submenuPopover = submenu.closest('.react-aria-Popover');
      expect(submenuPopover).toBeInTheDocument();
      expect(submenuPopover).toHaveAttribute('data-trigger', 'SubmenuTrigger');

      let nestedTriggerItem = getAllByRole('menuitem')[5];
      expect(nestedTriggerItem).toHaveTextContent('Email…');
      expect(nestedTriggerItem).toHaveAttribute('aria-haspopup', 'menu');
      expect(nestedTriggerItem).toHaveAttribute('aria-expanded', 'false');
      expect(nestedTriggerItem).toHaveAttribute('data-has-submenu', 'true');
      expect(nestedTriggerItem).not.toHaveAttribute('data-open');

      // Open the nested submenu
      await user.pointer({target: nestedTriggerItem});
      act(() => {jest.runAllTimers();});
      expect(nestedTriggerItem).toHaveAttribute('data-hovered', 'true');
      expect(nestedTriggerItem).toHaveAttribute('aria-expanded', 'true');
      expect(nestedTriggerItem).toHaveAttribute('data-open', 'true');
      let nestedSubmenu = getAllByRole('menu')[1];
      expect(nestedSubmenu).toBeInTheDocument();

      let nestedSubmenuPopover = nestedSubmenu.closest('.react-aria-Popover');
      expect(nestedSubmenuPopover).toBeInTheDocument();
      expect(nestedSubmenuPopover).toHaveAttribute('data-trigger', 'SubmenuTrigger');

      let underlay = getByTestId('underlay');
      expect(underlay).toBeInTheDocument();
      expect(underlay).toHaveAttribute('aria-hidden', 'true');
      await user.click(document.body);
      expect(nestedSubmenu).not.toBeInTheDocument();
      expect(submenu).not.toBeInTheDocument();
      expect(menu).not.toBeInTheDocument();
      expect(underlay).not.toBeInTheDocument();
    });
    it('should restore focus to menu trigger if submenu is closed with Escape key', async () => {
      let {getByRole, getAllByRole} = render(
        <MenuTrigger>
          <Button aria-label="Menu">☰</Button>
          <Popover>
            <Menu>
              <MenuItem id="open">Open</MenuItem>
              <MenuItem id="rename">Rename…</MenuItem>
              <MenuItem id="duplicate">Duplicate</MenuItem>
              <SubmenuTrigger>
                <MenuItem id="share">Share…</MenuItem>
                <Popover>
                  <Menu>
                    <MenuItem id="email">Email</MenuItem>
                    <MenuItem id="sms">SMS</MenuItem>
                    <MenuItem id="twitter">Twitter</MenuItem>
                  </Menu>
                </Popover>
              </SubmenuTrigger>
              <MenuItem id="delete">Delete…</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      );

      let button = getByRole('button');
      expect(button).not.toHaveAttribute('data-pressed');

      await user.click(button);
      expect(button).toHaveAttribute('data-pressed');

      let menu = getAllByRole('menu')[0];
      expect(getAllByRole('menuitem')).toHaveLength(5);

      let popover = menu.closest('.react-aria-Popover');
      expect(popover).toBeInTheDocument();
      expect(popover).toHaveAttribute('data-trigger', 'MenuTrigger');

      let triggerItem = getAllByRole('menuitem')[3];
      expect(triggerItem).toHaveTextContent('Share…');
      expect(triggerItem).toHaveAttribute('aria-haspopup', 'menu');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'false');
      expect(triggerItem).toHaveAttribute('data-has-submenu', 'true');
      expect(triggerItem).not.toHaveAttribute('data-open');

      // Open the submenu
      await user.pointer({target: triggerItem});
      act(() => {jest.runAllTimers();});
      expect(triggerItem).toHaveAttribute('data-hovered', 'true');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'true');
      expect(triggerItem).toHaveAttribute('data-open', 'true');
      let submenu = getAllByRole('menu')[1];
      expect(submenu).toBeInTheDocument();

      let submenuItems = within(submenu).getAllByRole('menuitem');
      expect(submenuItems).toHaveLength(3);

      await user.pointer({target: submenuItems[0]});
      act(() => {jest.runAllTimers();});
      expect(document.activeElement).toBe(submenuItems[0]);

      fireEvent.keyDown(document.activeElement, {key: 'Escape'});
      fireEvent.keyUp(document.activeElement, {key: 'Escape'});
      act(() => {jest.runAllTimers();});

      expect(submenu).not.toBeInTheDocument();
      expect(menu).not.toBeInTheDocument();
      expect(document.activeElement).toBe(button);
    });
    it('should restore focus to menu trigger if nested submenu is closed with Escape key', async () => {
      document.elementFromPoint = jest.fn().mockImplementation(query => query);
      let {getByRole, getAllByRole} = render(
        <MenuTrigger>
          <Button aria-label="Menu">☰</Button>
          <Popover>
            <Menu>
              <MenuItem id="open">Open</MenuItem>
              <MenuItem id="rename">Rename…</MenuItem>
              <MenuItem id="duplicate">Duplicate</MenuItem>
              <SubmenuTrigger>
                <MenuItem id="share">Share…</MenuItem>
                <Popover>
                  <Menu>
                    <SubmenuTrigger>
                      <MenuItem id="email">Email…</MenuItem>
                      <Popover>
                        <Menu>
                          <MenuItem id="work">Work</MenuItem>
                          <MenuItem id="personal">Personal</MenuItem>
                        </Menu>
                      </Popover>
                    </SubmenuTrigger>
                    <MenuItem id="sms">SMS</MenuItem>
                    <MenuItem id="twitter">Twitter</MenuItem>
                  </Menu>
                </Popover>
              </SubmenuTrigger>
              <MenuItem id="delete">Delete…</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      );

      let button = getByRole('button');
      expect(button).not.toHaveAttribute('data-pressed');

      await user.click(button);
      expect(button).toHaveAttribute('data-pressed');

      let menu = getAllByRole('menu')[0];
      expect(getAllByRole('menuitem')).toHaveLength(5);

      let popover = menu.closest('.react-aria-Popover');
      expect(popover).toBeInTheDocument();
      expect(popover).toHaveAttribute('data-trigger', 'MenuTrigger');

      let triggerItem = getAllByRole('menuitem')[3];
      expect(triggerItem).toHaveTextContent('Share…');
      expect(triggerItem).toHaveAttribute('aria-haspopup', 'menu');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'false');
      expect(triggerItem).toHaveAttribute('data-has-submenu', 'true');
      expect(triggerItem).not.toHaveAttribute('data-open');

      // Open the submenu
      await user.pointer({target: triggerItem});
      act(() => {jest.runAllTimers();});
      expect(triggerItem).toHaveAttribute('data-hovered', 'true');
      expect(triggerItem).toHaveAttribute('aria-expanded', 'true');
      expect(triggerItem).toHaveAttribute('data-open', 'true');
      let submenu = getAllByRole('menu')[1];
      expect(submenu).toBeInTheDocument();

      let submenuItems = within(submenu).getAllByRole('menuitem');
      expect(submenuItems).toHaveLength(3);

      // Open the nested submenu
      await user.pointer({target: submenuItems[0]});
      act(() => {jest.runAllTimers();});
      expect(document.activeElement).toBe(submenuItems[0]);

      let nestedSubmenu = getAllByRole('menu')[1];
      expect(nestedSubmenu).toBeInTheDocument();

      let nestedSubmenuItems = within(nestedSubmenu).getAllByRole('menuitem');
      await user.pointer({target: nestedSubmenuItems[0]});
      act(() => {jest.runAllTimers();});
      expect(document.activeElement).toBe(nestedSubmenuItems[0]);

      fireEvent.keyDown(document.activeElement, {key: 'Escape'});
      fireEvent.keyUp(document.activeElement, {key: 'Escape'});
      act(() => {jest.runAllTimers();});

      expect(nestedSubmenu).not.toBeInTheDocument();
      expect(submenu).not.toBeInTheDocument();
      expect(menu).not.toBeInTheDocument();
      expect(document.activeElement).toBe(button);
    });
    it('should not close the menu when clicking on a element within the submenu tree', async () => {
      let onAction = jest.fn();
      let {getByRole, getAllByRole, queryAllByRole} = render(
        <MenuTrigger>
          <Button aria-label="Menu">☰</Button>
          <Popover>
            <Menu onAction={onAction}>
              <MenuItem id="open">Open</MenuItem>
              <MenuItem id="rename">Rename…</MenuItem>
              <MenuItem id="duplicate">Duplicate</MenuItem>
              <SubmenuTrigger>
                <MenuItem id="share">Share…</MenuItem>
                <Popover>
                  <Menu onAction={onAction}>
                    <SubmenuTrigger>
                      <MenuItem id="email">Email…</MenuItem>
                      <Popover>
                        <Menu onAction={onAction}>
                          <MenuItem id="work">Work</MenuItem>
                          <MenuItem id="personal">Personal</MenuItem>
                        </Menu>
                      </Popover>
                    </SubmenuTrigger>
                    <MenuItem id="sms">SMS</MenuItem>
                    <MenuItem id="twitter">Twitter</MenuItem>
                  </Menu>
                </Popover>
              </SubmenuTrigger>
              <MenuItem id="delete">Delete…</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      );

      let button = getByRole('button');
      expect(button).not.toHaveAttribute('data-pressed');

      await user.click(button);
      expect(button).toHaveAttribute('data-pressed');

      let menu = getAllByRole('menu')[0];
      expect(getAllByRole('menuitem')).toHaveLength(5);

      let popover = menu.closest('.react-aria-Popover');
      expect(popover).toBeInTheDocument();

      let triggerItem = getAllByRole('menuitem')[3];

      // Open the submenu
      await user.pointer({target: triggerItem});
      act(() => {jest.runAllTimers();});
      let submenu = getAllByRole('menu')[1];
      expect(submenu).toBeInTheDocument();

      let nestedTriggerItem = getAllByRole('menuitem')[5];

      // Click a nested submenu item trigger
      await user.click(nestedTriggerItem);
      act(() => {jest.runAllTimers();});
      let menus = getAllByRole('menu', {hidden: true});
      expect(menus).toHaveLength(3);

      await user.click(getAllByRole('menuitem')[6]);
      menus = queryAllByRole('menu', {hidden: true});
      expect(menus).toHaveLength(0);
      expect(menu).not.toBeInTheDocument();
    });
    it('should support sections', async () => {
      let onAction = jest.fn();
      let {getByRole, getAllByRole} = render(
        <MenuTrigger>
          <Button aria-label="Menu">☰</Button>
          <Popover>
            <Menu onAction={onAction}>
              <Section>
                <Header>Actions</Header>
                <MenuItem id="open">Open</MenuItem>
                <MenuItem id="rename">Rename…</MenuItem>
                <MenuItem id="duplicate">Duplicate</MenuItem>
                <SubmenuTrigger>
                  <MenuItem id="share">Share…</MenuItem>
                  <Popover>
                    <Menu onAction={onAction}>
                      <Section>
                        <Header>Work</Header>
                        <MenuItem id="email-work">Email</MenuItem>
                        <MenuItem id="sms-work">SMS</MenuItem>
                        <MenuItem id="twitter-work">Twitter</MenuItem>
                      </Section>
                      <Separator />
                      <Section>
                        <Header>Personal</Header>
                        <MenuItem id="email-personal">Email</MenuItem>
                        <MenuItem id="sms-personal">SMS</MenuItem>
                        <MenuItem id="twitter-personal">Twitter</MenuItem>
                      </Section>
                    </Menu>
                  </Popover>
                </SubmenuTrigger>
                <MenuItem id="delete">Delete…</MenuItem>
              </Section>
              <Separator />
              <Section>
                <Header>Settings</Header>
                <MenuItem id="user">User Settings</MenuItem>
                <MenuItem id="system">System Settings</MenuItem>
              </Section>
            </Menu>
          </Popover>
        </MenuTrigger>
      );

      let button = getByRole('button');
      expect(button).not.toHaveAttribute('data-pressed');

      await user.click(button);
      expect(button).toHaveAttribute('data-pressed');

      let groups = getAllByRole('group');
      expect(groups).toHaveLength(2);

      expect(groups[0]).toHaveClass('react-aria-Section');
      expect(groups[1]).toHaveClass('react-aria-Section');

      expect(groups[0]).toHaveAttribute('aria-labelledby');
      expect(document.getElementById(groups[0].getAttribute('aria-labelledby'))).toHaveTextContent('Actions');

      expect(groups[1]).toHaveAttribute('aria-labelledby');
      expect(document.getElementById(groups[1].getAttribute('aria-labelledby'))).toHaveTextContent('Settings');

      let menu = getAllByRole('menu')[0];
      expect(getAllByRole('menuitem')).toHaveLength(7);

      let popover = menu.closest('.react-aria-Popover');
      expect(popover).toBeInTheDocument();
      expect(popover).toHaveAttribute('data-trigger', 'MenuTrigger');

      let triggerItem = getAllByRole('menuitem')[3];
      expect(triggerItem).toHaveTextContent('Share…');

      // Open the submenu
      await user.pointer({target: triggerItem});
      act(() => {jest.runAllTimers();});
      let submenu = getAllByRole('menu')[1];
      expect(submenu).toBeInTheDocument();

      let submenuItems = within(submenu).getAllByRole('menuitem');
      expect(submenuItems).toHaveLength(6);

      let groupsInSubmenu = within(submenu).getAllByRole('group');
      expect(groupsInSubmenu).toHaveLength(2);

      expect(groupsInSubmenu[0]).toHaveClass('react-aria-Section');
      expect(groupsInSubmenu[1]).toHaveClass('react-aria-Section');

      expect(groupsInSubmenu[0]).toHaveAttribute('aria-labelledby');
      expect(document.getElementById(groupsInSubmenu[0].getAttribute('aria-labelledby'))).toHaveTextContent('Work');

      expect(groupsInSubmenu[1]).toHaveAttribute('aria-labelledby');
      expect(document.getElementById(groupsInSubmenu[1].getAttribute('aria-labelledby'))).toHaveTextContent('Personal');

      await user.click(submenuItems[0]);
      act(() => {jest.runAllTimers();});

      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onAction).toHaveBeenLastCalledWith('email-work');

      expect(submenu).not.toBeInTheDocument();
      expect(menu).not.toBeInTheDocument();
    });
  });
});
