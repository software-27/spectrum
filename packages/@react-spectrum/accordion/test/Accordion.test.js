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

import {Accordion, Disclosure, DisclosureHeader, DisclosurePanel} from '../src';
import {act, pointerMap, render, within} from '@react-spectrum/test-utils-internal';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import {theme} from '@react-spectrum/theme-default';
import userEvent from '@testing-library/user-event';

let items = [
  {key: 'one', title: 'one title', children: 'one children'},
  {key: 'two', title: 'two title', children: 'two children'},
  {key: 'three', title: 'three title', children: <input type="text" />}
];

function renderComponent(props) {
  return render(
    <Provider theme={theme}>
      <Accordion {...props}>
        {items.map(item => (
          <Disclosure key={item.key}>
            <DisclosureHeader>{item.title}</DisclosureHeader>
            <DisclosurePanel>{item.children}</DisclosurePanel>
          </Disclosure>
        ))}
      </Accordion>
    </Provider>
  );
}

describe('Accordion', function () {
  let user;
  beforeAll(() => {
    user = userEvent.setup({delay: null, pointerMap});
  });

  it('renders properly', function () {
    let tree = renderComponent();
    let accordionItems = tree.getAllByRole('heading');
    expect(items.length).toBe(3);

    for (let item of accordionItems) {
      let button = within(item).getByRole('button');
      expect(button).toHaveAttribute('aria-expanded');
      let isExpanded = button.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        expect(button).toHaveAttribute('aria-controls');
        let region = document.getElementById(button.getAttribute('aria-controls'));
        expect(region).toBeTruthy();
        expect(region).toHaveAttribute('aria-labelledby', button.id);
        expect(region).toHaveAttribute('role', 'region');
        expect(region).toHaveTextContent(items[0].children);
      }
    }
  });

  it('toggle accordion on mouse click', async function () {
    let tree = renderComponent();
    let buttons = tree.getAllByRole('button');
    let selectedItem = buttons[0];
    expect(selectedItem).toHaveAttribute('aria-expanded', 'false');
    await user.click(selectedItem);
    expect(selectedItem).toHaveAttribute('aria-expanded', 'true');
    await user.click(selectedItem);
    expect(selectedItem).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows users to open and close disclosure with enter / space key', async function () {
    let tree = renderComponent();
    let buttons = tree.getAllByRole('button');
    let selectedItem = buttons[0];
    expect(selectedItem).toHaveAttribute('aria-expanded', 'false');
    act(() => {selectedItem.focus();});
    expect(document.activeElement).toBe(selectedItem);

    await user.keyboard('{Enter}');
    expect(selectedItem).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Enter}');
    expect(selectedItem).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows users to navigate accordion headers through the tab key', async function () {
    let tree = renderComponent();
    let buttons = tree.getAllByRole('button');
    let [firstItem, secondItem, thirdItem] = buttons;
    act(() => {firstItem.focus();});
    expect(document.activeElement).toBe(firstItem);
    await user.tab();
    expect(document.activeElement).toBe(secondItem);
    await user.tab({shift: true});
    expect(document.activeElement).toBe(firstItem);
    await user.tab();
    expect(document.activeElement).toBe(secondItem);
    await user.tab();
    expect(document.activeElement).toBe(thirdItem);
    await user.tab();
    expect(document.activeElement).not.toBe(firstItem);
    expect(document.activeElement).not.toBe(secondItem);
    expect(document.activeElement).not.toBe(thirdItem);
    await user.tab({shift: true});
    expect(document.activeElement).toBe(thirdItem);
  });

  it('allows users to type inside disclosures', async function () {
    let tree = renderComponent();
    let buttons = tree.getAllByRole('button');
    let itemWithInputHeader = buttons[2];
    act(() => itemWithInputHeader.click());

    let [input] = tree.getAllByRole('textbox');
    act(() => input.focus());

    await user.type(input, 'Type example');
    expect(input.value).toEqual('Type example');
  });
});


