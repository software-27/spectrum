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
import {ActionGroup, Content, Flex, Heading, Text} from '@adobe/react-spectrum';
import Bookmark from '@spectrum-icons/workflow/Bookmark';
import {Button} from '@react-spectrum/button';
import {ButtonGroup} from '@react-spectrum/buttongroup';
import Calendar from '@spectrum-icons/workflow/Calendar';
import Dashboard from '@spectrum-icons/workflow/Dashboard';
import {Item, TabList, TabPanels, Tabs} from '..';
import React from 'react';
import {storiesOf} from '@storybook/react';

storiesOf('Tabs', module)
  .add(
    'Default',
    () => render()
  )
  .add(
    'with falsy item key',
    () => renderWithFalsyKey()
  )
  .add(
    'defaultSelectedKey: val2',
    () => render({defaultSelectedKey: 'val2'})
  )
  .add(
    'controlled: selectedKey: val3',
    () => render({selectedKey: 'val3'})
  )
  .add(
    'orientation: vertical',
    () => render({orientation: 'vertical'}))
  .add(
    'density: compact',
    () => render({density: 'compact'}))
  .add(
    'isQuiet',
    () => render({isQuiet: true}))
  .add(
    'isQuiet, density: compact',
    () => render({isQuiet: true, density: 'compact'})
  )
  .add(
    'density: compact, orientation: vertical',
    () => render({density: 'compact', orientation: 'vertical'})
  )
  .add(
    'icons',
    () => renderWithIcons())
  .add(
    'icons, density: compact',
    () => renderWithIcons({density: 'compact'})
  )
  .add(
    'icons, orientation: vertical',
    () => renderWithIcons({orientation: 'vertical'})
  )
  .add(
    'icons, density: compact, orientation: vertical',
    () => renderWithIcons({orientation: 'vertical', density: 'compact'})
  )
  .add(
    'disable all tabs',
    () => render({isDisabled: true}))
  .add(
    'keyboardActivation: manual',
    () => render({keyboardActivation: 'manual'})
  )
  .add(
    'middle disabled',
    () => render({disabledKeys: ['val2']})
  )
  .add(
    'all disabled',
    () => render({disabledKeys: ['val1', 'val2', 'val3', 'val4', 'val5']})
  )
  .add(
    'resizeable',
    () => (
      <div style={{minWidth: '100px', width: '300px', height: '400px', padding: '10px', resize: 'horizontal', overflow: 'auto', backgroundColor: 'var(--spectrum-global-color-gray-50)'}}>
        {render()}
      </div>
    )
  )
  .add(
    'collapse behavior',
    () => <DynamicTabs />
  )
  .add(
    'collapse behavior, isQuiet',
    () => <DynamicTabs isQuiet />
  )
  .add(
    'collapse behavior, density: compact',
    () => <DynamicTabs density="compact" />
  )
  .add(
    'collapse behavior, density: compact, isQuiet',
    () => <DynamicTabs isQuiet density="compact" />
  )
  .add(
    'orientation flip',
    () => <OrientationFlip />
  )
  .add(
    'testing: tabs in flex',
    () => (
      <Flex minHeight={400} minWidth={400} UNSAFE_style={{borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--spectrum-global-color-gray-800)', padding: '10px'}}>
        <Tabs>
          <TabList>
            <Item title="Tab 1" />
            <Item title="Tab 2" />
          </TabList>
          <TabPanels>
            <Item title="Tab 1">
              <Content>
                <Text>Hello World</Text>
              </Content>
            </Item>
            <Item title="Tab 2">
              <Content>
                <Text>Goodbye World</Text>
              </Content>
            </Item>
          </TabPanels>
        </Tabs>
      </Flex>
    )
  )
  .add(
    'transition between tab sizes',
    () => (
      (
        <Tabs maxWidth={500}>
          <TabList>
            <Item>
              <Text>Tab 1 long long long name</Text>
            </Item>
            <Item>
              <Text>Tab 2</Text>
            </Item>
          </TabList>
          <TabPanels>
            <Item>
              <Content margin="size-160">
                <Text>Text</Text>
              </Content>
            </Item>
            <Item>
              <Content margin="size-160">
                <Text>Text 2</Text>
              </Content>
            </Item>
          </TabPanels>
        </Tabs>
      )
    )
  )
  .add(
    'Tab with flex container in between',
    () => <DynamicTabsWithDecoration />
  );

function render(props = {}) {
  return (
    <Tabs {...props} aria-label="Tab example" maxWidth={500} onSelectionChange={action('onSelectionChange')}>
      <TabList>
        <Item title="Tab 1" key="val1" />
        <Item title="Tab 2" key="val2" />
        <Item title="Tab 3" key="val3" />
        <Item title="Tab 4" key="val4" />
        <Item title="Tab 5" key="val5" />
      </TabList>
      <TabPanels>
        <Item title="Tab 1" key="val1">
          <Content margin="size-160">
            <Heading>Tab Body 1</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item title="Tab 2" key="val2">
          <Content margin="size-160">
            <Heading>Tab Body 2</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item title="Tab 3" key="val3">
          <Content margin="size-160">
            <Heading>Tab Body 3</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item title="Tab 4" key="val4">
          <Content margin="size-160">
            <Heading>Tab Body 4</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item title="Tab 5" key="val5">
          <Content margin="size-160">
            <Heading>Tab Body 5</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

function renderWithIcons(props = {}) {
  return (
    <Tabs {...props} aria-label="Tab example" maxWidth={500} onSelectionChange={action('onSelectionChange')}>
      <TabList>
        <Item key="dashboard" textValue="Dashboard">
          <Dashboard />
          <Text>Dashboard</Text>
        </Item>
        <Item key="calendar" textValue="Calendar">
          <Calendar />
          <Text>Calendar</Text>
        </Item>
        <Item key="bookmark" textValue="Bookmark">
          <Bookmark />
          <Text>Bookmark</Text>
        </Item>
      </TabList>
      <TabPanels>
        <Item key="dashboard">
          <Content margin="size-160">
            <Heading>Dashboard</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item key="calendar" textValue="Calendar">
          <Content margin="size-160">
            <Heading>Calendar</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item key="bookmark">
          <Content margin="size-160">
            <Heading>Bookmark</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

function renderWithFalsyKey(props = {}) {
  return (
    <Tabs {...props} aria-label="Tab example" maxWidth={500} onSelectionChange={action('onSelectionChange')}>
      <TabList>
        <Item title="Tab 1" key="" />
        <Item title="Tab 2" key="val2" />
        <Item title="Tab 3" key="val3" />
        <Item title="Tab 4" key="val4" />
        <Item title="Tab 5" key="val5" />
      </TabList>
      <TabPanels>
        <Item title="Tab 1" key="">
          <Content margin="size-160">
            <Heading>Tab Body 1</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item title="Tab 2" key="val2">
          <Content margin="size-160">
            <Heading>Tab Body 2</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item title="Tab 3" key="val3">
          <Content margin="size-160">
            <Heading>Tab Body 3</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item title="Tab 4" key="val4">
          <Content margin="size-160">
            <Heading>Tab Body 4</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
        <Item title="Tab 5" key="val5">
          <Content margin="size-160">
            <Heading>Tab Body 5</Heading>
            <Text>
              Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
              Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
              Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
            </Text>
          </Content>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

let items = [
  {name: 'Tab 1', children: 'Tab Body 1', icon: <Dashboard size="S" />},
  {name: 'Tab 2', children: 'Tab Body 2', icon: <Calendar size="S" />},
  {name: 'Tab 3', children: 'Tab Body 3', icon: <Bookmark size="S" />},
  {name: 'Tab 4', children: 'Tab Body 4', icon: <Dashboard size="S" />},
  {name: 'Tab 5', children: 'Tab Body 5', icon: <Calendar size="S" />},
  {name: 'Tab 6', children: 'Tab Body 6', icon: <Bookmark size="S" />}
];

let DynamicTabs = (props = {}) => {

  let [tabs, setTabs] = React.useState(items);
  let addTab = () => {
    let newTabs = [...tabs];
    newTabs.push({
      name: `Tab ${tabs.length + 1}`,
      children: `Tab Body ${tabs.length + 1}`
    });

    setTabs(newTabs);
  };

  let removeTab = () => {
    let newTabs = [...tabs];
    newTabs.pop();
    setTabs(newTabs);
  };

  return (
    <div style={{width: '80%'}}>
      <Tabs {...props} aria-label="Tab example" items={tabs} onSelectionChange={action('onSelectionChange')}>
        <TabList>
          {item => (
            <Item key={item.name} textValue={item.name}>
              {item.icon}
              <Text>{item.name}</Text>
            </Item>
          )}
        </TabList>
        <TabPanels>
          {item => (
            <Item key={item.name}>
              <Content margin="size-160">
                <Heading>{item.children}</Heading>
                <Text>
                  Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
                  Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
                  Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
                </Text>
              </Content>
            </Item>
          )}
        </TabPanels>
      </Tabs>
      <ButtonGroup marginEnd="30px">
        <Button variant="secondary" onPress={() => addTab()}>
          <Text>Add Tab</Text>
        </Button>
        <Button variant="secondary" onPress={() => removeTab()}>
          <Text>Remove Tab</Text>
        </Button>
      </ButtonGroup>
    </div>
  );
};

let OrientationFlip = (props = {}) => {
  let [flipOrientation, setFlipOrientation] = React.useState(true);

  return (
    <div style={{width: '80%'}}>
      <Tabs {...props} aria-label="Tab example" items={items} onSelectionChange={action('onSelectionChange')} orientation={flipOrientation ? 'horizontal' : 'vertical'}>
        <TabList>
          {item => (
            <Item key={item.name} textValue={item.name}>
              {item.icon}
              <Text>{item.name}</Text>
            </Item>
          )}
        </TabList>
        <TabPanels>
          {item => (
            <Item key={item.name}>
              <Content margin="size-160">
                <Heading>{item.children}</Heading>
                <Text>
                  Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
                  Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
                  Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
                </Text>
              </Content>
            </Item>
          )}
        </TabPanels>
      </Tabs>
      <Button variant="secondary" onPress={() => setFlipOrientation((state) => !state)}>
        <Text>Flip Orientation</Text>
      </Button>
    </div>
  );
};


let DynamicTabsWithDecoration = (props = {}) => {

  let [tabs, setTabs] = React.useState(items);
  let addTab = () => {
    let newTabs = [...tabs];
    newTabs.push({
      name: `Tab ${tabs.length + 1}`,
      children: `Tab Body ${tabs.length + 1}`
    });

    setTabs(newTabs);
  };

  let removeTab = () => {
    if (tabs.length > 1) {
      let newTabs = [...tabs];
      newTabs.pop();
      setTabs(newTabs);
    }
  };

  return (
    <div style={{width: '80%'}}>
      <Tabs {...props} aria-label="Tab example" items={tabs} onSelectionChange={action('onSelectionChange')}>
        <Flex direction="column">
          <Flex direction="row" alignItems="center">
            <TabList>
              {item => (
                <Item key={item.name} textValue={item.name}>
                  {item.icon}
                  <Text>{item.name}</Text>
                </Item>
              )}
            </TabList>
            <Flex alignItems="center" justifyContent="end" flexGrow={1} alignSelf="stretch" UNSAFE_style={{borderBottom: 'var(--spectrum-alias-border-size-thick) solid var(--spectrum-global-color-gray-200)'}}>
              <ActionGroup marginEnd="30px" disabledKeys={tabs.length === 1 ? ['remove'] : undefined} onAction={val => val === 'add' ? addTab() : removeTab()}>
                <Item key="add">
                  <Text>Add Tab</Text>
                </Item>
                <Item key="remove">
                  <Text>Remove Tab</Text>
                </Item>
              </ActionGroup>
            </Flex>
          </Flex>
          <TabPanels>
            {item => (
              <Item key={item.name}>
                <Content margin="size-160">
                  <Heading>{item.children}</Heading>
                  <Text>
                    Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing.
                    Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do.
                    Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.
                  </Text>
                </Content>
              </Item>
            )}
          </TabPanels>
        </Flex>
      </Tabs>
    </div>
  );
};
