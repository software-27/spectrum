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
import {
  Button, Dialog,
  DialogTrigger,
  DropIndicator,
  Header, Heading,
  ListBox,
  ListBoxContext,
  ListBoxItem, Modal,
  Section,
  Text,
  useDragAndDrop
} from '../';
import React, {useState} from 'react';
import userEvent from '@testing-library/user-event';

let TestListBox = ({listBoxProps, itemProps}) => (
  <ListBox aria-label="Test" {...listBoxProps}>
    <ListBoxItem {...itemProps} id="cat">Cat</ListBoxItem>
    <ListBoxItem {...itemProps} id="dog">Dog</ListBoxItem>
    <ListBoxItem {...itemProps} id="kangaroo">Kangaroo</ListBoxItem>
  </ListBox>
);

let DraggableListBox = (props) => {
  let {dragAndDropHooks} = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({'text/plain': key})),
    ...props
  });

  return (
    <ListBox aria-label="Test" dragAndDropHooks={dragAndDropHooks} {...props}>
      <ListBoxItem id="cat">Cat</ListBoxItem>
      <ListBoxItem id="dog">Dog</ListBoxItem>
      <ListBoxItem id="kangaroo">Kangaroo</ListBoxItem>
    </ListBox>
  );
};

let renderListbox = (listBoxProps, itemProps) => render(<TestListBox {...{listBoxProps, itemProps}} />);
let keyPress = (key) => {
  fireEvent.keyDown(document.activeElement, {key});
  fireEvent.keyUp(document.activeElement, {key});
};

describe('ListBox', () => {
  let user;
  beforeAll(() => {
    user = userEvent.setup({delay: null, pointerMap});
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {jest.runAllTimers();});
    jest.restoreAllMocks();
  });

  it('should render with default classes', () => {
    let {getByRole, getAllByRole} = renderListbox();
    let listbox = getByRole('listbox');
    expect(listbox).toHaveAttribute('class', 'react-aria-ListBox');

    for (let option of getAllByRole('option')) {
      expect(option).toHaveAttribute('class', 'react-aria-ListBoxItem');
    }
  });

  it('should render with custom classes', () => {
    let {getByRole, getAllByRole} = renderListbox({className: 'listbox'}, {className: 'item'});
    let listbox = getByRole('listbox');
    expect(listbox).toHaveAttribute('class', 'listbox');

    for (let option of getAllByRole('option')) {
      expect(option).toHaveAttribute('class', 'item');
    }
  });

  it('should support DOM props', () => {
    let {getByRole, getAllByRole} = renderListbox({'data-foo': 'bar'}, {'data-bar': 'foo'});
    let listbox = getByRole('listbox');
    expect(listbox).toHaveAttribute('data-foo', 'bar');

    for (let option of getAllByRole('option')) {
      expect(option).toHaveAttribute('data-bar', 'foo');
    }
  });

  it('should support aria-label on the listbox items', () => {
    let {getAllByRole} = renderListbox({}, {'aria-label': 'test'});

    for (let option of getAllByRole('option')) {
      expect(option).toHaveAttribute('aria-label', 'test');
    }
  });

  it('should support the slot prop', () => {
    let {getByRole} = render(
      <ListBoxContext.Provider value={{slots: {test: {'aria-label': 'test'}}}}>
        <TestListBox listBoxProps={{slot: 'test', 'aria-label': undefined}} />
      </ListBoxContext.Provider>
    );

    let listbox = getByRole('listbox');
    expect(listbox).toHaveAttribute('slot', 'test');
    expect(listbox).toHaveAttribute('aria-label', 'test');
  });

  it('should support refs', () => {
    let listBoxRef = React.createRef();
    let sectionRef = React.createRef();
    let itemRef = React.createRef();
    render(
      <ListBox aria-label="Test" ref={listBoxRef}>
        <Section ref={sectionRef}>
          <ListBoxItem ref={itemRef}>Cat</ListBoxItem>
        </Section>
      </ListBox>
    );
    expect(listBoxRef.current).toBeInstanceOf(HTMLElement);
    expect(sectionRef.current).toBeInstanceOf(HTMLElement);
    expect(itemRef.current).toBeInstanceOf(HTMLElement);
  });

  it('should support slots', () => {
    let {getByRole} = render(
      <ListBox aria-label="Sandwich contents" selectionMode="multiple">
        <ListBoxItem textValue="Read">
          <Text slot="label">Read</Text>
          <Text slot="description">Read only</Text>
        </ListBoxItem>
      </ListBox>
    );

    let option = getByRole('option');
    expect(option).toHaveAttribute('aria-labelledby');
    expect(document.getElementById(option.getAttribute('aria-labelledby'))).toHaveTextContent('Read');
    expect(option).toHaveAttribute('aria-describedby');
    expect(document.getElementById(option.getAttribute('aria-describedby'))).toHaveTextContent('Read only');
  });

  it('should support sections', () => {
    let {getAllByRole} = render(
      <ListBox aria-label="Sandwich contents" selectionMode="multiple">
        <Section data-test-prop="test-section-1">
          <Header>Veggies</Header>
          <ListBoxItem id="lettuce">Lettuce</ListBoxItem>
          <ListBoxItem id="tomato">Tomato</ListBoxItem>
          <ListBoxItem id="onion">Onion</ListBoxItem>
        </Section>
        <Section data-test-prop="test-section-2" aria-label="Protein">
          <ListBoxItem id="ham">Ham</ListBoxItem>
          <ListBoxItem id="tuna">Tuna</ListBoxItem>
          <ListBoxItem id="tofu">Tofu</ListBoxItem>
        </Section>
      </ListBox>
    );

    let groups = getAllByRole('group');
    expect(groups).toHaveLength(2);

    expect(groups[0]).toHaveClass('react-aria-Section');
    expect(groups[1]).toHaveClass('react-aria-Section');

    expect(groups[0]).toHaveAttribute('aria-labelledby');
    expect(document.getElementById(groups[0].getAttribute('aria-labelledby'))).toHaveTextContent('Veggies');
    expect(groups[1].getAttribute('aria-label')).toEqual('Protein');

    expect(groups[0]).toHaveAttribute('data-test-prop', 'test-section-1');
    expect(groups[1]).toHaveAttribute('data-test-prop', 'test-section-2');
  });

  it('should support dynamic collections', () => {
    let options = [
      {id: 1, name: 'Cat'},
      {id: 2, name: 'Dog'}
    ];

    let {getAllByRole, rerender} = render(
      <ListBox aria-label="Animals" items={options}>
        {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
      </ListBox>
    );

    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['Cat', 'Dog']);

    options = [
      options[0],
      options[1],
      {id: 3, name: 'Mouse'}
    ];
    rerender(
      <ListBox aria-label="Animals" items={options}>
        {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
      </ListBox>
    );

    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['Cat', 'Dog', 'Mouse']);

    options = [
      options[0],
      {id: 4, name: 'Kangaroo'},
      options[1],
      options[2]
    ];
    rerender(
      <ListBox aria-label="Animals" items={options}>
        {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
      </ListBox>
    );

    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['Cat', 'Kangaroo', 'Dog', 'Mouse']);

    options = [
      options[0],
      options[1],
      {id: 2, name: 'Doggy'},
      options[3]
    ];
    rerender(
      <ListBox aria-label="Animals" items={options}>
        {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
      </ListBox>
    );

    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['Cat', 'Kangaroo', 'Doggy', 'Mouse']);

    options = [
      options[0],
      options[1],
      options[3],
      options[2]
    ];
    rerender(
      <ListBox aria-label="Animals" items={options}>
        {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
      </ListBox>
    );

    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['Cat', 'Kangaroo', 'Mouse', 'Doggy']);

    options = [
      options[0],
      options[1],
      options[2]
    ];
    rerender(
      <ListBox aria-label="Animals" items={options}>
        {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
      </ListBox>
    );

    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['Cat', 'Kangaroo', 'Mouse']);
  });

  it('should update collection when descendants update', () => {
    let setShowTwo;
    let setItemText;
    function Child() {
      let [showTwo, _setShowTwo] = useState(false);
      setShowTwo = _setShowTwo;
      let [itemText, _setItemText] = useState('One');
      setItemText = _setItemText;
      return (
        <>
          <ListBoxItem id={1}>{itemText}</ListBoxItem>
          {showTwo && <ListBoxItem id={2}>Two</ListBoxItem>}
        </>
      );
    }

    let {getAllByRole} = render(
      <ListBox aria-label="Example">
        <Child />
      </ListBox>
    );

    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['One']);

    act(() => setShowTwo(true));
    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['One', 'Two']);

    act(() => setShowTwo(false));
    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['One']);

    act(() => setItemText('Hi'));
    expect(getAllByRole('option').map(o => o.textContent)).toEqual(['Hi']);
  });

  it('should support hover', async () => {
    let hoverStartSpy = jest.fn();
    let hoverChangeSpy = jest.fn();
    let hoverEndSpy = jest.fn();
    let {getAllByRole} = renderListbox({selectionMode: 'multiple'}, {className: ({isHovered}) => isHovered ? 'hover' : '', onHoverStart: hoverStartSpy, onHoverEnd: hoverEndSpy, onHoverChange: hoverChangeSpy});
    let option = getAllByRole('option')[0];

    expect(option).not.toHaveAttribute('data-hovered');
    expect(option).not.toHaveClass('hover');

    await user.hover(option);
    expect(option).toHaveAttribute('data-hovered', 'true');
    expect(option).toHaveClass('hover');
    expect(hoverStartSpy).toHaveBeenCalledTimes(1);
    expect(hoverChangeSpy).toHaveBeenCalledTimes(1);

    await user.unhover(option);
    expect(option).not.toHaveAttribute('data-hovered');
    expect(option).not.toHaveClass('hover');
    expect(hoverEndSpy).toHaveBeenCalledTimes(1);
    expect(hoverChangeSpy).toHaveBeenCalledTimes(2);
  });

  it('should not show hover state when item is not interactive', async () => {
    let {getAllByRole} = renderListbox({}, {className: ({isHovered}) => isHovered ? 'hover' : ''});
    let option = getAllByRole('option')[0];

    expect(option).not.toHaveAttribute('data-hovered');
    expect(option).not.toHaveClass('hover');

    await user.hover(option);
    expect(option).not.toHaveAttribute('data-hovered');
    expect(option).not.toHaveClass('hover');
  });

  it('should support focus ring', async () => {
    let {getAllByRole} = renderListbox({selectionMode: 'multiple', shouldFocusOnHover: true}, {className: ({isFocusVisible}) => isFocusVisible ? 'focus' : ''});
    let option = getAllByRole('option')[0];

    expect(option).not.toHaveAttribute('data-focus-visible');
    expect(option).not.toHaveClass('focus');

    await user.tab();
    expect(document.activeElement).toBe(option);
    expect(option).toHaveAttribute('data-focus-visible', 'true');
    expect(option).toHaveClass('focus');
    expect(option).not.toHaveAttribute('data-hovered');

    fireEvent.keyDown(option, {key: 'ArrowDown'});
    fireEvent.keyUp(option, {key: 'ArrowDown'});
    expect(option).not.toHaveAttribute('data-focus-visible');
    expect(option).not.toHaveClass('focus');
  });

  it('should support press state', () => {
    let {getAllByRole} = renderListbox({selectionMode: 'multiple'}, {className: ({isPressed}) => isPressed ? 'pressed' : ''});
    let option = getAllByRole('option')[0];

    expect(option).not.toHaveAttribute('data-pressed');
    expect(option).not.toHaveClass('pressed');

    fireEvent.mouseDown(option);
    expect(option).toHaveAttribute('data-pressed', 'true');
    expect(option).toHaveClass('pressed');

    fireEvent.mouseUp(option);
    expect(option).not.toHaveAttribute('data-pressed');
    expect(option).not.toHaveClass('pressed');
  });

  it('should not show press state when not interactive', () => {
    let {getAllByRole} = renderListbox({}, {className: ({isPressed}) => isPressed ? 'pressed' : ''});
    let option = getAllByRole('option')[0];

    expect(option).not.toHaveAttribute('data-pressed');
    expect(option).not.toHaveClass('pressed');

    fireEvent.mouseDown(option);
    expect(option).not.toHaveAttribute('data-pressed');
    expect(option).not.toHaveClass('pressed');

    fireEvent.mouseUp(option);
    expect(option).not.toHaveAttribute('data-pressed');
    expect(option).not.toHaveClass('pressed');
  });

  it('should support selection state', async () => {
    let {getAllByRole} = renderListbox({selectionMode: 'multiple'}, {className: ({isSelected}) => isSelected ? 'selected' : ''});
    let option = getAllByRole('option')[0];

    expect(option).not.toHaveAttribute('aria-selected', 'true');
    expect(option).not.toHaveClass('selected');

    await user.click(option);
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(option).toHaveClass('selected');

    await user.click(option);
    expect(option).not.toHaveAttribute('aria-selected', 'true');
    expect(option).not.toHaveClass('selected');
  });

  it('should support disabled state', () => {
    let {getAllByRole} = renderListbox({selectionMode: 'multiple', disabledKeys: ['cat']}, {className: ({isDisabled}) => isDisabled ? 'disabled' : ''});
    let option = getAllByRole('option')[0];

    expect(option).toHaveAttribute('aria-disabled', 'true');
    expect(option).toHaveClass('disabled');
  });

  it('should support isDisabled prop on items', async () => {
    let {getAllByRole} = render(
      <ListBox aria-label="Test">
        <ListBoxItem id="cat">Cat</ListBoxItem>
        <ListBoxItem id="dog" isDisabled>Dog</ListBoxItem>
        <ListBoxItem id="kangaroo">Kangaroo</ListBoxItem>
      </ListBox>
    );
    let items = getAllByRole('option');
    expect(items[1]).toHaveAttribute('aria-disabled', 'true');

    await user.tab();
    expect(document.activeElement).toBe(items[0]);
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(items[2]);
  });

  it('should support onAction on items', async () => {
    let onAction = jest.fn();
    let {getAllByRole} = render(
      <ListBox aria-label="Test">
        <ListBoxItem id="cat" onAction={onAction}>Cat</ListBoxItem>
        <ListBoxItem id="dog">Dog</ListBoxItem>
        <ListBoxItem id="kangaroo">Kangaroo</ListBoxItem>
      </ListBox>
    );
    let items = getAllByRole('option');
    await user.click(items[0]);
    expect(onAction).toHaveBeenCalled();
  });

  it('should support empty state', () => {
    let {getByRole} = render(
      <ListBox aria-label="Test" renderEmptyState={() => 'No results'}>
        {[]}
      </ListBox>
    );
    let listbox = getByRole('listbox');
    expect(listbox).toHaveAttribute('data-empty', 'true');

    let option = getByRole('option');
    expect(option).toHaveTextContent('No results');
  });

  it('should support horizontal orientation', async () => {
    let {getAllByRole} = renderListbox({orientation: 'horizontal'});
    let options = getAllByRole('option');

    await user.tab();
    expect(document.activeElement).toBe(options[0]);

    keyPress('ArrowRight');
    expect(document.activeElement).toBe(options[1]);

    keyPress('ArrowRight');
    expect(document.activeElement).toBe(options[2]);

    keyPress('ArrowLeft');
    expect(document.activeElement).toBe(options[1]);
  });

  it('should support grid layout', async () => {
    let {getAllByRole} = renderListbox({layout: 'grid'});
    let options = getAllByRole('option');

    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      if (this.getAttribute('role') === 'listbox') {
        return {top: 0, left: 0, bottom: 200, right: 200, width: 200, height: 200};
      } else {
        let index = [...this.parentElement.children].indexOf(this);
        return {top: Math.floor(index / 2) * 40, left: index % 2 ? 100 : 0, bottom: Math.floor(index / 2) * 40 + 40, right: index % 2 ? 200 : 100, width: 100, height: 40};
      }
    });

    await user.tab();
    expect(document.activeElement).toBe(options[0]);

    keyPress('ArrowDown');
    expect(document.activeElement).toBe(options[2]);

    keyPress('ArrowLeft');
    expect(document.activeElement).toBe(options[1]);

    keyPress('ArrowLeft');
    expect(document.activeElement).toBe(options[0]);

    keyPress('ArrowRight');
    expect(document.activeElement).toBe(options[1]);
  });

  it('should support horizontal grid layout', async () => {
    let {getAllByRole} = renderListbox({layout: 'grid', orientation: 'horizontal'});
    let options = getAllByRole('option');

    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      if (this.getAttribute('role') === 'listbox') {
        return {top: 0, left: 0, bottom: 200, right: 200, width: 200, height: 200};
      } else {
        let index = [...this.parentElement.children].indexOf(this);
        return {top: (index % 2) * 40, left: index < 2 ? 0 : 100, bottom: (index % 2) * 40 + 40, right: index < 2 ? 100 : 200, width: 100, height: 40};
      }
    });

    await user.tab();
    expect(document.activeElement).toBe(options[0]);

    keyPress('ArrowRight');
    expect(document.activeElement).toBe(options[2]);

    keyPress('ArrowUp');
    expect(document.activeElement).toBe(options[1]);

    keyPress('ArrowUp');
    expect(document.activeElement).toBe(options[0]);

    keyPress('ArrowDown');
    expect(document.activeElement).toBe(options[1]);
  });

  it('should support onScroll', () => {
    let onScroll = jest.fn();
    let {getByRole} = renderListbox({onScroll});
    let listbox = getByRole('listbox');
    fireEvent.scroll(listbox);
    expect(onScroll).toHaveBeenCalled();
  });

  describe('drag and drop', () => {
    it('should support draggable items', () => {
      let {getAllByRole} = render(<DraggableListBox />);
      let options = getAllByRole('option');
      expect(options[0]).toHaveAttribute('draggable');
    });

    it('should render drop indicators', () => {
      let onReorder = jest.fn();
      let {getAllByRole} = render(<DraggableListBox onReorder={onReorder} renderDropIndicator={(target) => <DropIndicator target={target}>Test</DropIndicator>} />);
      let option = getAllByRole('option')[0];
      fireEvent.keyDown(option, {key: 'Enter'});
      fireEvent.keyUp(option, {key: 'Enter'});
      act(() => jest.runAllTimers());

      let rows = getAllByRole('option');
      expect(rows).toHaveLength(4);
      expect(rows[0]).toHaveAttribute('class', 'react-aria-DropIndicator');
      expect(rows[0]).toHaveAttribute('data-drop-target', 'true');
      expect(rows[0]).toHaveAttribute('aria-label', 'Insert before Cat');
      expect(rows[0]).toHaveTextContent('Test');
      expect(rows[1]).toHaveAttribute('class', 'react-aria-DropIndicator');
      expect(rows[1]).not.toHaveAttribute('data-drop-target');
      expect(rows[1]).toHaveAttribute('aria-label', 'Insert between Cat and Dog');
      expect(rows[2]).toHaveAttribute('class', 'react-aria-DropIndicator');
      expect(rows[2]).not.toHaveAttribute('data-drop-target');
      expect(rows[2]).toHaveAttribute('aria-label', 'Insert between Dog and Kangaroo');
      expect(rows[3]).toHaveAttribute('class', 'react-aria-DropIndicator');
      expect(rows[3]).not.toHaveAttribute('data-drop-target');
      expect(rows[3]).toHaveAttribute('aria-label', 'Insert after Kangaroo');

      fireEvent.keyDown(document.activeElement, {key: 'ArrowDown'});
      fireEvent.keyUp(document.activeElement, {key: 'ArrowDown'});

      expect(document.activeElement).toHaveAttribute('aria-label', 'Insert between Cat and Dog');
      expect(rows[0]).not.toHaveAttribute('data-drop-target', 'true');
      expect(rows[1]).toHaveAttribute('data-drop-target', 'true');

      fireEvent.keyDown(document.activeElement, {key: 'Enter'});
      fireEvent.keyUp(document.activeElement, {key: 'Enter'});
      act(() => jest.runAllTimers());

      expect(onReorder).toHaveBeenCalledTimes(1);
    });

    it('should support dropping on rows', () => {
      let onItemDrop = jest.fn();
      let {getAllByRole} = render(<>
        <DraggableListBox />
        <DraggableListBox onItemDrop={onItemDrop} />
      </>);

      let option = getAllByRole('option')[0];
      fireEvent.keyDown(option, {key: 'Enter'});
      fireEvent.keyUp(option, {key: 'Enter'});
      act(() => jest.runAllTimers());

      let listboxes = getAllByRole('listbox');
      let rows = within(listboxes[1]).getAllByRole('option');
      expect(rows).toHaveLength(3);
      expect(rows[0]).toHaveAttribute('data-drop-target', 'true');
      expect(rows[1]).not.toHaveAttribute('data-drop-target');
      expect(rows[2]).not.toHaveAttribute('data-drop-target');

      expect(document.activeElement).toBe(rows[0]);

      fireEvent.keyDown(document.activeElement, {key: 'Enter'});
      fireEvent.keyUp(document.activeElement, {key: 'Enter'});
      act(() => jest.runAllTimers());

      expect(onItemDrop).toHaveBeenCalledTimes(1);
    });

    it('should support dropping on the root', () => {
      let onRootDrop = jest.fn();
      let {getAllByRole} = render(<>
        <DraggableListBox />
        <DraggableListBox onRootDrop={onRootDrop} />
      </>);

      let option = getAllByRole('option')[0];
      fireEvent.keyDown(option, {key: 'Enter'});
      fireEvent.keyUp(option, {key: 'Enter'});
      act(() => jest.runAllTimers());

      let listboxes = getAllByRole('listbox');
      expect(document.activeElement).toBe(listboxes[1]);
      expect(listboxes[1]).toHaveAttribute('data-drop-target', 'true');

      fireEvent.keyDown(document.activeElement, {key: 'Enter'});
      fireEvent.keyUp(document.activeElement, {key: 'Enter'});
      act(() => jest.runAllTimers());

      expect(onRootDrop).toHaveBeenCalledTimes(1);
    });

    it('should support horizontal orientation', async () => {
      let onReorder = jest.fn();
      let {getAllByRole} = render(<DraggableListBox onReorder={onReorder} orientation="horizontal" />);
      let options = getAllByRole('option');

      await user.tab();
      expect(document.activeElement).toBe(options[0]);
      keyPress('Enter');
      act(() => jest.runAllTimers());

      options = getAllByRole('option');
      expect(document.activeElement).toHaveAttribute('aria-label', 'Insert between Cat and Dog');

      keyPress('ArrowRight');
      expect(document.activeElement).toHaveAttribute('aria-label', 'Insert between Dog and Kangaroo');

      keyPress('Escape');
      act(() => jest.runAllTimers());
    });

    it('should support grid layout', async () => {
      let onReorder = jest.fn();
      let {getAllByRole} = render(<DraggableListBox onReorder={onReorder} layout="grid" />);
      let options = getAllByRole('option');

      jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (this.getAttribute('role') === 'listbox') {
          return {top: 0, left: 0, bottom: 200, right: 200, width: 200, height: 200};
        } else {
          let index = [...this.parentElement.children].filter(c => c.hasAttribute('data-key')).indexOf(this);
          return {top: Math.floor(index / 2) * 40, left: index % 2 ? 100 : 0, bottom: Math.floor(index / 2) * 40 + 40, right: index % 2 ? 200 : 100, width: 100, height: 40};
        }
      });

      await user.tab();
      expect(document.activeElement).toBe(options[0]);
      keyPress('Enter');
      act(() => jest.runAllTimers());

      options = getAllByRole('option');
      expect(document.activeElement).toHaveAttribute('aria-label', 'Insert between Cat and Dog');

      keyPress('ArrowDown');
      expect(document.activeElement).toHaveAttribute('aria-label', 'Insert after Kangaroo');

      keyPress('Escape');
      act(() => jest.runAllTimers());
    });

    it('should support horizontal grid layout', async () => {
      let onReorder = jest.fn();
      let {getAllByRole} = render(<DraggableListBox onReorder={onReorder} layout="grid" orientation="horizontal" />);
      let options = getAllByRole('option');

      jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
        if (this.getAttribute('role') === 'listbox') {
          return {top: 0, left: 0, bottom: 200, right: 200, width: 200, height: 200};
        } else {
          let index = [...this.parentElement.children].filter(c => c.hasAttribute('data-key')).indexOf(this);
          return {top: (index % 2) * 40, left: index < 2 ? 0 : 100, bottom: (index % 2) * 40 + 40, right: index < 2 ? 100 : 200, width: 100, height: 40};
        }
      });

      await user.tab();
      expect(document.activeElement).toBe(options[0]);
      keyPress('Enter');
      act(() => jest.runAllTimers());

      options = getAllByRole('option');
      expect(document.activeElement).toHaveAttribute('aria-label', 'Insert between Cat and Dog');

      keyPress('ArrowRight');
      expect(document.activeElement).toHaveAttribute('aria-label', 'Insert after Kangaroo');

      keyPress('Escape');
      act(() => jest.runAllTimers());
    });
  });

  describe('inside modals', () => {
    it('should clear selection on first Escape, then allow the modal to close on the second Escape', async () => {
      let onOpenChange = jest.fn();
      let {getAllByRole, getByRole} = render(
        <DialogTrigger onOpenChange={onOpenChange}>
          <Button>Open Dialog</Button>
          <Modal>
            <Dialog>
              <form>
                <Heading slot="title">Sign up</Heading>
                <ListBox aria-label="Test" selectionMode="multiple">
                  <ListBoxItem id="cat">Cat</ListBoxItem>
                  <ListBoxItem id="dog">Dog</ListBoxItem>
                  <ListBoxItem id="kangaroo">Kangaroo</ListBoxItem>
                </ListBox>
              </form>
            </Dialog>
          </Modal>
        </DialogTrigger>
      );
      await user.tab();
      expect(document.activeElement).toBe(getByRole('button'));
      await user.keyboard('{Enter}');
      expect(onOpenChange).toHaveBeenCalledTimes(1);

      let options = getAllByRole('option');

      await user.tab();
      expect(document.activeElement).toBe(options[0]);
      await user.keyboard('{Enter}');

      expect(options[0]).toHaveAttribute('aria-selected', 'true');

      keyPress('Escape');

      expect(options[0]).toBeInTheDocument();
      expect(options[0]).toHaveAttribute('aria-selected', 'false');

      keyPress('Escape');
      expect(options[0]).not.toBeInTheDocument();
      expect(onOpenChange).toHaveBeenCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('links', function () {
    describe.each(['mouse', 'keyboard'])('%s', (type) => {
      let trigger = async (item) => {
        if (type === 'mouse') {
          await user.click(item);
        } else {
          fireEvent.keyDown(item, {key: 'Enter'});
          fireEvent.keyUp(item, {key: 'Enter'});
        }
      };

      it('should support links with selectionMode="none"', async function () {
        let {getAllByRole} = render(
          <ListBox aria-label="listbox">
            <ListBoxItem href="https://google.com">One</ListBoxItem>
            <ListBoxItem href="https://adobe.com">Two</ListBoxItem>
          </ListBox>
        );

        let items = getAllByRole('option');
        for (let item of items) {
          expect(item.tagName).toBe('A');
          expect(item).toHaveAttribute('href');
        }

        let onClick = mockClickDefault();
        await trigger(items[0]);
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick.mock.calls[0][0].target).toBeInstanceOf(HTMLAnchorElement);
        expect(onClick.mock.calls[0][0].target.href).toBe('https://google.com/');
      });

      it.each(['single', 'multiple'])('should support links with selectionMode="%s"', async function (selectionMode) {
        let {getAllByRole} = render(
          <ListBox aria-label="listbox" selectionMode={selectionMode}>
            <ListBoxItem href="https://google.com">One</ListBoxItem>
            <ListBoxItem href="https://adobe.com">Two</ListBoxItem>
          </ListBox>
        );

        let items = getAllByRole('option');
        for (let item of items) {
          expect(item.tagName).toBe('A');
          expect(item).toHaveAttribute('href');
        }

        let onClick = mockClickDefault();
        await trigger(items[0]);
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick.mock.calls[0][0].target).toBeInstanceOf(HTMLAnchorElement);
        expect(onClick.mock.calls[0][0].target.href).toBe('https://google.com/');
        expect(items[0]).not.toHaveAttribute('aria-selected', 'true');

        await trigger(items[1]);
        expect(onClick).toHaveBeenCalledTimes(2);
        expect(onClick.mock.calls[1][0].target).toBeInstanceOf(HTMLAnchorElement);
        expect(onClick.mock.calls[1][0].target.href).toBe('https://adobe.com/');
        expect(items[1]).not.toHaveAttribute('aria-selected', 'true');
      });

      it.each(['single', 'multiple'])('should support links with selectionMode="%s" selectionBehavior="replace"', async function (selectionMode) {
        let {getAllByRole} = render(
          <ListBox aria-label="listbox" selectionMode={selectionMode} selectionBehavior="replace">
            <ListBoxItem href="https://google.com">One</ListBoxItem>
            <ListBoxItem href="https://adobe.com">Two</ListBoxItem>
          </ListBox>
        );

        let items = getAllByRole('option');
        for (let item of items) {
          expect(item.tagName).toBe('A');
          expect(item).toHaveAttribute('href');
        }

        let onClick = mockClickDefault();
        if (type === 'mouse') {
          await user.click(items[0]);
        } else {
          fireEvent.keyDown(items[0], {key: ' '});
          fireEvent.keyUp(items[0], {key: ' '});
        }
        expect(onClick).not.toHaveBeenCalled();
        expect(items[0]).toHaveAttribute('aria-selected', 'true');

        if (type === 'mouse') {
          await user.dblClick(items[0], {pointerType: 'mouse'});
        } else {
          fireEvent.keyDown(items[0], {key: 'Enter'});
          fireEvent.keyUp(items[0], {key: 'Enter'});
        }
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick.mock.calls[0][0].target).toBeInstanceOf(HTMLAnchorElement);
        expect(onClick.mock.calls[0][0].target.href).toBe('https://google.com/');
      });
    });
  });
});
