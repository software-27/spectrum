/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import {act, fireEvent, render as renderComponent, within} from '@testing-library/react';
import {ActionButton} from '@react-spectrum/button';
import {installPointerEvent} from '@react-spectrum/test-utils';
import {Item, ListView} from '../src';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {theme} from '@react-spectrum/theme-default';
import userEvent from '@testing-library/user-event';

function pointerEvent(type, opts) {
  let evt = new Event(type, {bubbles: true, cancelable: true});
  Object.assign(evt, {
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    button: opts.button || 0,
    width: 1,
    height: 1
  }, opts);
  return evt;
}

describe('ListView', function () {
  let offsetWidth, offsetHeight;

  beforeAll(function () {
    offsetWidth = jest.spyOn(window.HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => 1000);
    offsetHeight = jest.spyOn(window.HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => 1000);
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
    jest.useFakeTimers('legacy');
  });

  afterAll(function () {
    offsetWidth.mockReset();
    offsetHeight.mockReset();
  });

  let render = (children, locale = 'en-US', scale = 'medium') => {
    let tree = renderComponent(
      <Provider theme={theme} scale={scale} locale={locale}>
        {children}
      </Provider>
    );
    // Allow for Virtualizer layout to update
    act(() => {jest.runAllTimers();});
    return tree;
  };

  let getCell = (tree, text) => {
    // Find by text, then go up to the element with the cell role.
    let el = tree.getByText(text);
    while (el && !/gridcell|rowheader|columnheader/.test(el.getAttribute('role'))) {
      el = el.parentElement;
    }

    return el;
  };

  it('renders a static listview', function () {
    let {getByRole, getAllByRole} = render(
      <ListView aria-label="List" data-testid="test">
        <Item>Foo</Item>
        <Item>Bar</Item>
        <Item>Baz</Item>
      </ListView>
    );

    let grid = getByRole('grid');
    expect(grid).toBeVisible();
    expect(grid).toHaveAttribute('aria-label', 'List');
    expect(grid).toHaveAttribute('data-testid', 'test');
    expect(grid).toHaveAttribute('aria-rowcount', '3');
    expect(grid).toHaveAttribute('aria-colcount', '1');

    let rows = getAllByRole('row');
    expect(rows).toHaveLength(3);

    let gridCells = within(rows[0]).getAllByRole('gridcell');
    expect(gridCells).toHaveLength(1);
    expect(gridCells[0]).toHaveTextContent('Foo');
  });

  it('renders a dynamic table', function () {
    let items = [
      {key: 'foo', label: 'Foo'},
      {key: 'bar', label: 'Bar'},
      {key: 'baz', label: 'Baz'}
    ];
    let {getByRole, getAllByRole} = render(
      <ListView items={items} aria-label="List">
        {item =>
          <Item textValue={item.key}>{item.label}</Item>
        }
      </ListView>
    );

    let grid = getByRole('grid');
    expect(grid).toBeVisible();
    expect(grid).toHaveAttribute('aria-label', 'List');
    expect(grid).toHaveAttribute('aria-rowcount', '3');
    expect(grid).toHaveAttribute('aria-colcount', '1');

    let rows = getAllByRole('row');
    expect(rows).toHaveLength(3);

    let gridCells = within(rows[0]).getAllByRole('gridcell');
    expect(gridCells).toHaveLength(1);
    expect(gridCells[0]).toHaveTextContent('Foo');
  });

  describe('keyboard focus', function () {
    let items = [
      {key: 'foo', label: 'Foo'},
      {key: 'bar', label: 'Bar'},
      {key: 'baz', label: 'Baz'}
    ];
    let renderList = () => render(
      <ListView items={items} aria-label="List">
        {item => (
          <Item textValue={item.key}>
            {item.label}
          </Item>
        )}
      </ListView>
    );

    let renderListWithFocusables = (locale, scale) => render(
      <ListView items={items} aria-label="List">
        {item => (
          <Item textValue={item.key}>
            {item.label}
            <ActionButton>button1 {item.label}</ActionButton>
            <ActionButton>button2 {item.label}</ActionButton>
          </Item>
        )}
      </ListView>,
      locale,
      scale
    );

    let moveFocus = (key, opts = {}) => {fireEvent.keyDown(document.activeElement, {key, ...opts});};

    describe('Type to select', function () {
      it('focuses the correct cell when typing', function () {
        let tree = renderList();
        let target = getCell(tree, 'Baz');
        let grid = tree.getByRole('grid');
        act(() => grid.focus());
        fireEvent.keyDown(grid, {key: 'B'});
        fireEvent.keyUp(grid, {key: 'Enter'});
        fireEvent.keyDown(grid, {key: 'A'});
        fireEvent.keyUp(grid, {key: 'A'});
        fireEvent.keyDown(grid, {key: 'Z'});
        fireEvent.keyUp(grid, {key: 'Z'});
        expect(document.activeElement).toBe(target);
      });
    });

    describe('ArrowRight', function () {
      it('should not move focus if no focusables present', function () {
        let tree = renderList();
        let start = getCell(tree, 'Foo');
        act(() => start.focus());
        moveFocus('ArrowRight');
        expect(document.activeElement).toBe(start);
      });

      describe('with cell focusables', function () {
        it('should move focus to next cell and back to row', function () {
          let tree = renderListWithFocusables();
          let focusables = within(tree.getAllByRole('row')[0]).getAllByRole('button');
          let start = getCell(tree, 'Foo');
          act(() => start.focus());
          moveFocus('ArrowRight');
          expect(document.activeElement).toBe(focusables[0]);
          moveFocus('ArrowRight');
          expect(document.activeElement).toBe(focusables[1]);
          moveFocus('ArrowRight');
          expect(document.activeElement).toBe(start);
        });

        it('should move focus to previous cell in RTL', function () {
          let tree = renderListWithFocusables('ar-AE');
          // Should move from button two to button one
          let start = within(tree.getAllByRole('row')[0]).getAllByRole('button')[1];
          let end = within(tree.getAllByRole('row')[0]).getAllByRole('button')[0];
          act(() => start.focus());
          expect(document.activeElement).toHaveTextContent('button2 Foo');
          moveFocus('ArrowRight');
          expect(document.activeElement).toBe(end);
          expect(document.activeElement).toHaveTextContent('button1 Foo');
        });
      });
    });

    describe('ArrowLeft', function () {
      it('should not move focus if no focusables present', function () {
        let tree = renderList();
        let start = getCell(tree, 'Foo');
        act(() => start.focus());
        moveFocus('ArrowLeft');
        expect(document.activeElement).toBe(start);
      });

      describe('with cell focusables', function () {
        it('should move focus to previous cell and back to row', function () {
          let tree = renderListWithFocusables();
          let focusables = within(tree.getAllByRole('row')[0]).getAllByRole('button');
          let start = getCell(tree, 'Foo');
          // console.log('start', start)
          act(() => start.focus());
          moveFocus('ArrowLeft');
          expect(document.activeElement).toBe(focusables[1]);
          moveFocus('ArrowLeft');
          expect(document.activeElement).toBe(focusables[0]);
          moveFocus('ArrowLeft');
          expect(document.activeElement).toBe(start);
        });

        it('should move focus to next cell in RTL', function () {
          let tree = renderListWithFocusables('ar-AE');
          // Should move from button one to button two
          let start = within(tree.getAllByRole('row')[0]).getAllByRole('button')[0];
          let end = within(tree.getAllByRole('row')[0]).getAllByRole('button')[1];
          act(() => start.focus());
          expect(document.activeElement).toHaveTextContent('button1 Foo');
          moveFocus('ArrowLeft');
          expect(document.activeElement).toBe(end);
          expect(document.activeElement).toHaveTextContent('button2 Foo');
        });
      });
    });

    describe('ArrowUp', function () {
      it('should not change focus from first item', function () {
        let tree = renderListWithFocusables();
        let start = getCell(tree, 'Foo');
        act(() => start.focus());
        moveFocus('ArrowUp');
        expect(document.activeElement).toBe(start);
      });

      it('should move focus to above row', function () {
        let tree = renderListWithFocusables();
        let start = getCell(tree, 'Bar');
        let end = getCell(tree, 'Foo');
        act(() => start.focus());
        moveFocus('ArrowUp');
        expect(document.activeElement).toBe(end);
      });
    });

    describe('ArrowDown', function () {
      it('should not change focus from first item', function () {
        let tree = renderListWithFocusables();
        let start = getCell(tree, 'Baz');
        act(() => start.focus());
        moveFocus('ArrowDown');
        expect(document.activeElement).toBe(start);
      });

      it('should move focus to below row', function () {
        let tree = renderListWithFocusables();
        let start = getCell(tree, 'Foo');
        let end = getCell(tree, 'Bar');
        act(() => start.focus());
        moveFocus('ArrowDown');
        expect(document.activeElement).toBe(end);
      });
    });
  });

  it('should display loading affordance with proper height (isLoading)', function () {
    let {getAllByRole} = render(<ListView aria-label="List" loadingState="loading">{[]}</ListView>);
    let row = getAllByRole('row')[0];
    expect(row.parentNode.style.height).toBe('1000px');
    let progressbar = within(row).getByRole('progressbar');
    expect(progressbar).toBeTruthy();
  });

  it('should display loading affordance with proper height (isLoadingMore)', function () {
    let items = [
      {key: 'foo', label: 'Foo'},
      {key: 'bar', label: 'Bar'},
      {key: 'baz', label: 'Baz'}
    ];
    let {getByRole} = render(
      <ListView items={items} aria-label="List" loadingState="loadingMore">
        {item =>
          <Item textValue={item.key}>{item.label}</Item>
        }
      </ListView>
    );
    let progressbar = getByRole('progressbar');
    expect(progressbar).toBeTruthy();
    expect(progressbar.parentNode.parentNode.parentNode.style.height).toBe('40px');
  });

  it('should render empty state', function () {
    function renderEmptyState() {
      return <div>No results</div>;
    }
    let {getByText} = render(<ListView aria-label="List" renderEmptyState={renderEmptyState} />);
    expect(getByText('No results')).toBeTruthy();
  });

  describe('selection', function () {
    installPointerEvent();
    let checkSelection = (onSelectionChange, selectedKeys) => {
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(new Set(onSelectionChange.mock.calls[0][0])).toEqual(new Set(selectedKeys));
    };

    let items = [
      {key: 'foo', label: 'Foo'},
      {key: 'bar', label: 'Bar'},
      {key: 'baz', label: 'Baz'}
    ];
    let renderSelectionList = (props) => render(
      <ListView items={items} aria-label="List" {...props}>
        {item => (
          <Item key={item.key} textValue={item.key}>
            {item.label}
          </Item>
        )}
      </ListView>
    );

    describe('selection', function () {
      it('should select an item from checkbox', function () {
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple'});

        let row = tree.getAllByRole('row')[1];
        expect(row).toHaveAttribute('aria-selected', 'false');
        act(() => userEvent.click(within(row).getByRole('checkbox')));

        checkSelection(onSelectionChange, ['bar']);
        expect(row).toHaveAttribute('aria-selected', 'true');
      });

      it('should select a row by pressing the Space key on a row', function () {
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple'});

        let row = tree.getAllByRole('row')[1];
        expect(row).toHaveAttribute('aria-selected', 'false');
        fireEvent.keyDown(row, {key: ' '});
        fireEvent.keyUp(row, {key: ' '});

        checkSelection(onSelectionChange, ['bar']);
        expect(row).toHaveAttribute('aria-selected', 'true');
      });

      it('should select a row by pressing the Enter key on a row', function () {
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple'});

        let row = tree.getAllByRole('row')[1];
        expect(row).toHaveAttribute('aria-selected', 'false');
        fireEvent.keyDown(row, {key: 'Enter'});
        fireEvent.keyUp(row, {key: 'Enter'});

        checkSelection(onSelectionChange, ['bar']);
        expect(row).toHaveAttribute('aria-selected', 'true');
      });

      it('should only allow one item to be selected in single selection', function () {
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'single'});

        let rows = tree.getAllByRole('row');
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        act(() => userEvent.click(within(rows[1]).getByRole('checkbox')));

        checkSelection(onSelectionChange, ['bar']);
        expect(rows[1]).toHaveAttribute('aria-selected', 'true');

        onSelectionChange.mockClear();
        act(() => userEvent.click(within(rows[2]).getByRole('checkbox')));
        checkSelection(onSelectionChange, ['baz']);
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        expect(rows[2]).toHaveAttribute('aria-selected', 'true');
      });

      it('should allow multiple items to be selected in multiple selection', function () {
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple'});

        let rows = tree.getAllByRole('row');
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        act(() => userEvent.click(within(rows[1]).getByRole('checkbox')));

        checkSelection(onSelectionChange, ['bar']);
        expect(rows[1]).toHaveAttribute('aria-selected', 'true');

        onSelectionChange.mockClear();
        act(() => userEvent.click(within(rows[2]).getByRole('checkbox')));
        checkSelection(onSelectionChange, ['bar', 'baz']);
        expect(rows[1]).toHaveAttribute('aria-selected', 'true');
        expect(rows[2]).toHaveAttribute('aria-selected', 'true');
      });

      it('should toggle items in selection highlight with ctrl-click on Mac', function () {
        let uaMock = jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'Mac');
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple', selectionStyle: 'highlight'});

        let rows = tree.getAllByRole('row');
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        expect(rows[2]).toHaveAttribute('aria-selected', 'false');
        act(() => userEvent.click(getCell(tree, 'Bar'), {ctrlKey: true}));

        checkSelection(onSelectionChange, ['bar']);
        expect(rows[1]).toHaveAttribute('aria-selected', 'true');

        onSelectionChange.mockClear();
        act(() => userEvent.click(getCell(tree, 'Baz'), {ctrlKey: true}));
        checkSelection(onSelectionChange, ['baz']);
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        expect(rows[2]).toHaveAttribute('aria-selected', 'true');

        uaMock.mockRestore();
      });

      it('should allow multiple items to be selected in selection highlight with ctrl-click on Windows', function () {
        let uaMock = jest.spyOn(navigator, 'userAgent', 'get').mockImplementation(() => 'Windows');
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple', selectionStyle: 'highlight'});

        let rows = tree.getAllByRole('row');
        expect(rows[0]).toHaveAttribute('aria-selected', 'false');
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        expect(rows[2]).toHaveAttribute('aria-selected', 'false');
        act(() => userEvent.click(getCell(tree, 'Foo'), {ctrlKey: true}));

        checkSelection(onSelectionChange, ['foo']);
        expect(rows[0]).toHaveAttribute('aria-selected', 'true');

        onSelectionChange.mockClear();
        act(() => userEvent.click(getCell(tree, 'Baz'), {ctrlKey: true}));
        checkSelection(onSelectionChange, ['foo', 'baz']);
        expect(rows[0]).toHaveAttribute('aria-selected', 'true');
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        expect(rows[2]).toHaveAttribute('aria-selected', 'true');

        uaMock.mockRestore();
      });

      it('should toggle items in selection highlight with meta-click on Windows', function () {
        let uaMock = jest.spyOn(navigator, 'userAgent', 'get').mockImplementation(() => 'Windows');
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple', selectionStyle: 'highlight'});

        let rows = tree.getAllByRole('row');
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        expect(rows[2]).toHaveAttribute('aria-selected', 'false');
        act(() => userEvent.click(getCell(tree, 'Bar'), {metaKey: true}));

        checkSelection(onSelectionChange, ['bar']);
        expect(rows[1]).toHaveAttribute('aria-selected', 'true');

        onSelectionChange.mockClear();
        act(() => userEvent.click(getCell(tree, 'Baz'), {metaKey: true}));
        checkSelection(onSelectionChange, ['baz']);
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');
        expect(rows[2]).toHaveAttribute('aria-selected', 'true');

        uaMock.mockRestore();
      });

      it('should support single tap to perform row selection with screen reader if onAction isn\'t provided', function () {
        let onSelectionChange = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple', selectionStyle: 'highlight'});

        let rows = tree.getAllByRole('row');
        expect(rows[1]).toHaveAttribute('aria-selected', 'false');

        act(() => userEvent.click(within(rows[1]).getByText('Bar'), {pointerType: 'touch', width: 0, height: 0}));
        checkSelection(onSelectionChange, [
          'bar'
        ]);
        expect(rows[1]).toHaveAttribute('aria-selected', 'true');
        onSelectionChange.mockReset();

        // Android TalkBack double tap test, pointer event sets pointerType and onClick handles the rest
        expect(rows[2]).toHaveAttribute('aria-selected', 'false');
        act(() => {
          let el = within(rows[2]).getByText('Baz');
          fireEvent(el, pointerEvent('pointerdown', {pointerId: 1, width: 1, height: 1, pressure: 0, detail: 0}));
          fireEvent(el, pointerEvent('pointerup', {pointerId: 1, width: 1, height: 1, pressure: 0, detail: 0}));
          fireEvent.click(el, {pointerType: 'mouse', width: 1, height: 1, detail: 1});
        });
        checkSelection(onSelectionChange, [
          'bar', 'baz'
        ]);
        expect(rows[1]).toHaveAttribute('aria-selected', 'true');
        expect(rows[2]).toHaveAttribute('aria-selected', 'true');
      });

      it('should support single tap to perform onAction with screen reader', function () {
        let onSelectionChange = jest.fn();
        let onAction = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple', selectionStyle: 'highlight', onAction});

        let rows = tree.getAllByRole('row');
        act(() => userEvent.click(within(rows[1]).getByText('Bar'), {pointerType: 'touch', width: 0, height: 0}));
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onAction).toHaveBeenCalledWith('bar');

        // Android TalkBack double tap test, pointer event sets pointerType and onClick handles the rest
        act(() => {
          let el = within(rows[2]).getByText('Baz');
          fireEvent(el, pointerEvent('pointerdown', {pointerId: 1, width: 1, height: 1, pressure: 0, detail: 0}));
          fireEvent(el, pointerEvent('pointerup', {pointerId: 1, width: 1, height: 1, pressure: 0, detail: 0}));
          fireEvent.click(el, {pointerType: 'mouse', width: 1, height: 1, detail: 1});
        });
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(onAction).toHaveBeenCalledTimes(2);
        expect(onAction).toHaveBeenCalledWith('baz');
      });

      it('should not call onSelectionChange when hitting Space/Enter on the currently selected row', function () {
        let onSelectionChange = jest.fn();
        let onAction = jest.fn();
        let tree = renderSelectionList({onSelectionChange, selectionMode: 'multiple', selectionStyle: 'highlight', onAction});

        let row = tree.getAllByRole('row')[1];
        expect(row).toHaveAttribute('aria-selected', 'false');
        act(() => userEvent.click(getCell(tree, 'Bar'), {ctrlKey: true}));

        checkSelection(onSelectionChange, ['bar']);
        expect(row).toHaveAttribute('aria-selected', 'true');
        expect(onAction).toHaveBeenCalledTimes(0);

        fireEvent.keyDown(row, {key: 'Space'});
        fireEvent.keyUp(row, {key: 'Space'});
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
        expect(onAction).toHaveBeenCalledTimes(0);

        fireEvent.keyDown(row, {key: 'Enter'});
        fireEvent.keyUp(row, {key: 'Enter'});
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onAction).toHaveBeenCalledWith('bar');
      });
    });
  });

  describe('scrolling', function () {
    beforeAll(() => {
      jest.spyOn(window.HTMLElement.prototype, 'scrollHeight', 'get')
        .mockImplementation(function () {
          return 40;
        });
    });

    let moveFocus = (key, opts = {}) => {
      fireEvent.keyDown(document.activeElement, {key, ...opts});
      fireEvent.keyUp(document.activeElement, {key, ...opts});
    };

    it('should scroll to a cell when it is focused', function () {
      let onSelectionChange = jest.fn();

      let tree = render(
        <ListView
          width="250px"
          height="60px"
          aria-label="List"
          data-testid="test"
          selectionStyle="highlight"
          selectionMode="multiple"
          onSelectionChange={onSelectionChange}
          items={[...Array(20).keys()].map(k => ({key: k, name: `Item ${k}`}))}>
          {item => <Item>{item.name}</Item>}
        </ListView>
      );
      let grid = tree.getByRole('grid');
      Object.defineProperty(grid, 'clientHeight', {
        get() {
          return 60;
        }
      });
      // fire resize so the new clientHeight is requested
      act(() => {
        fireEvent(window, new Event('resize'));
      });
      userEvent.tab();
      expect(grid.scrollTop).toBe(0);

      let rows = tree.getAllByRole('row');
      let rowWrappers = rows.map(item => item.parentElement);

      expect(rowWrappers[0].style.top).toBe('0px');
      expect(rowWrappers[0].style.height).toBe('40px');
      expect(rowWrappers[1].style.top).toBe('40px');
      expect(rowWrappers[1].style.height).toBe('40px');

      // scroll us down far enough that item 0 isn't in the view
      moveFocus('ArrowDown');
      moveFocus('ArrowDown');
      moveFocus('ArrowDown');
      expect(document.activeElement).toBe(getCell(tree, 'Item 3'));
      expect(grid.scrollTop).toBe(100);

      moveFocus('ArrowUp');
      moveFocus('ArrowUp');
      moveFocus('ArrowUp');
      expect(document.activeElement).toBe(getCell(tree, 'Item 0'));
      expect(grid.scrollTop).toBe(0);
    });
  });
});
