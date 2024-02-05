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

import {action} from '@storybook/addon-actions';
import {Button, Header, Keyboard, Menu, MenuTrigger, Popover, Section, Separator, SubmenuTrigger, Text} from 'react-aria-components';
import {MyMenuItem} from './utils';
import React from 'react';
import styles from '../example/index.css';

export default {
  title: 'React Aria Components'
};

export const MenuExample = () => (
  <MenuTrigger>
    <Button aria-label="Menu">☰</Button>
    <Popover>
      <Menu className={styles.menu} onAction={action('onAction')}>
        <Section className={styles.group}>
          <Header style={{fontSize: '1.2em'}}>Section 1</Header>
          <MyMenuItem>Foo</MyMenuItem>
          <MyMenuItem>Bar</MyMenuItem>
          <MyMenuItem>Baz</MyMenuItem>
          <MyMenuItem href="https://google.com">Google</MyMenuItem>
        </Section>
        <Separator style={{borderTop: '1px solid gray', margin: '2px 5px'}} />
        <Section className={styles.group}>
          <Header style={{fontSize: '1.2em'}}>Section 2</Header>
          <MyMenuItem>Foo</MyMenuItem>
          <MyMenuItem>Bar</MyMenuItem>
          <MyMenuItem>Baz</MyMenuItem>
        </Section>
      </Menu>
    </Popover>
  </MenuTrigger>
);

export const MenuComplex = () => (
  <MenuTrigger>
    <Button aria-label="Menu">☰</Button>
    <Popover>
      <Menu className={styles.menu}>
        <MyMenuItem>
          <Text slot="label">Copy</Text>
          <Text slot="description">Description</Text>
          <Keyboard>⌘C</Keyboard>
        </MyMenuItem>
        <MyMenuItem>
          <Text slot="label">Cut</Text>
          <Text slot="description">Description</Text>
          <Keyboard>⌘X</Keyboard>
        </MyMenuItem>
        <MyMenuItem>
          <Text slot="label">Paste</Text>
          <Text slot="description">Description</Text>
          <Keyboard>⌘V</Keyboard>
        </MyMenuItem>
      </Menu>
    </Popover>
  </MenuTrigger>
);

export const SubmenuExample = (args) => (
  <MenuTrigger>
    <Button aria-label="Menu">☰</Button>
    <Popover>
      <Menu className={styles.menu} onAction={action('onAction')}>
        <MyMenuItem id="Foo">Foo</MyMenuItem>
        <SubmenuTrigger {...args}>
          <MyMenuItem id="Bar">Bar</MyMenuItem>
          <Popover className={styles.popover}>
            <Menu className={styles.menu} onAction={action('onAction')}>
              <MyMenuItem id="Submenu Foo">Submenu Foo</MyMenuItem>
              <MyMenuItem id="Submenu Bar">Submenu Bar</MyMenuItem>
              <MyMenuItem id="Submenu Baz">Submenu Baz</MyMenuItem>
            </Menu>
          </Popover>
        </SubmenuTrigger>
        <MyMenuItem id="Baz">Baz</MyMenuItem>
        <MyMenuItem id="Google" href="https://google.com">Google</MyMenuItem>
      </Menu>
    </Popover>
  </MenuTrigger>
);

export const SubmenuNestedExample = (args) => (
  <MenuTrigger>
    <Button aria-label="Menu">☰</Button>
    <Popover>
      <Menu className={styles.menu} onAction={action('onAction')}>
        <MyMenuItem id="Foo">Foo</MyMenuItem>
        <SubmenuTrigger {...args}>
          <MyMenuItem id="Bar">Bar</MyMenuItem>
          <Popover className={styles.popover}>
            <Menu className={styles.menu} onAction={action('onAction')}>
              <MyMenuItem id="Submenu Foo">Submenu Foo</MyMenuItem>
              <MyMenuItem id="Submenu Bar">Submenu Bar</MyMenuItem>
              <SubmenuTrigger {...args}>
                <MyMenuItem id="Submenu Baz">Submenu Baz</MyMenuItem>
                <Popover className={styles.popover}>
                  <Menu className={styles.menu} onAction={action('onAction')}>
                    <MyMenuItem id="Second Submenu Foo">Second Submenu Foo</MyMenuItem>
                    <MyMenuItem id="Second Submenu Bar">Second Submenu Bar</MyMenuItem>
                    <MyMenuItem id="Second Submenu Baz">Second Submenu Baz</MyMenuItem>
                  </Menu>
                </Popover>
              </SubmenuTrigger>
            </Menu>
          </Popover>
        </SubmenuTrigger>
        <MyMenuItem id="Baz">Baz</MyMenuItem>
        <MyMenuItem id="Google" href="https://google.com">Google</MyMenuItem>
      </Menu>
    </Popover>
  </MenuTrigger>
);

let manyItemsSubmenu = [
  {id: 'Lvl 1 Item 1', name: 'Lvl 1 Item 1'},
  {id: 'Lvl 1 Item 2', name: 'Lvl 1 Item 2', children: [
    ...[...Array(30)].map((_, i) => ({id: `Lvl 2 Item ${i + 1}`, name: `Lvl 2 Item ${i + 1}`})),
    {id: 'Lvl 2 Item 31', name: 'Lvl 2 Item 31', children: [
      {id: 'Lvl 3 Item 1', name: 'Lvl 3 Item 1'},
      {id: 'Lvl 3 Item 2', name: 'Lvl 3 Item 2'},
      {id: 'Lvl 3 Item 3', name: 'Lvl 3 Item 3'}
    ]}
  ]},
  ...[...Array(30)].map((_, i) => ({id: `Lvl 1 Item ${i + 3}`, name: `Lvl 1 Item ${i + 3}`}))
];

let dynamicRenderFunc = (item, args) => {
  if (item.children) {
    return (
      <SubmenuTrigger {...args}>
        <MyMenuItem key={item.name}>{item.name}</MyMenuItem>
        <Popover className={styles.popover}>
          <Menu items={item.children} className={styles.menu} onAction={action('onAction')}>
            {(item) => dynamicRenderFunc(item, args)}
          </Menu>
        </Popover>
      </SubmenuTrigger>
    );
  } else {
    return <MyMenuItem key={item.name}>{item.name}</MyMenuItem>;
  }
};

export const SubmenuManyItemsExample = (args) => (
  <MenuTrigger>
    <Button aria-label="Menu">☰</Button>
    <Popover>
      <Menu items={manyItemsSubmenu} className={styles.menu} onAction={action('onAction')}>
        {(item) => dynamicRenderFunc(item, args)}
      </Menu>
    </Popover>
  </MenuTrigger>
);

export const SubmenuDisabledExample = (args) => (
  <MenuTrigger>
    <Button aria-label="Menu">☰</Button>
    <Popover>
      <Menu className={styles.menu} onAction={action('onAction')} disabledKeys={['Bar']}>
        <MyMenuItem id="Foo">Foo</MyMenuItem>
        <SubmenuTrigger {...args}>
          <MyMenuItem id="Bar">Bar</MyMenuItem>
          <Popover className={styles.popover}>
            <Menu className={styles.menu} onAction={action('onAction')}>
              <MyMenuItem id="Submenu Foo">Submenu Foo</MyMenuItem>
              <MyMenuItem id="Submenu Bar">Submenu Bar</MyMenuItem>
              <MyMenuItem id="Submenu Baz">Submenu Baz</MyMenuItem>
            </Menu>
          </Popover>
        </SubmenuTrigger>
        <MyMenuItem id="Baz">Baz</MyMenuItem>
        <MyMenuItem id="Google" href="https://google.com">Google</MyMenuItem>
      </Menu>
    </Popover>
  </MenuTrigger>
);

let submenuArgs = {
  args: {
    delay: 200
  },
  argTypes: {
    delay: {
      control: 'number'
    }
  }
};

SubmenuExample.story = {...submenuArgs};
SubmenuNestedExample.story = {...submenuArgs};
SubmenuManyItemsExample.story = {...submenuArgs};
SubmenuDisabledExample.story = {...submenuArgs};
