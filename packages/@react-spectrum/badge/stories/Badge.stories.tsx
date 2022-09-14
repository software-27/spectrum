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

import {Badge} from '../';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import {ComponentMeta, ComponentStoryObj} from '@storybook/react';
import React from 'react';
import {Text} from '@react-spectrum/text';

type BadgeStory = ComponentStoryObj<typeof Badge>;

export default {
  title: 'Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['positive', 'negative', 'neutral', 'info', 'indigo', 'yellow', 'magenta', 'fuchsia', 'purple', 'seafoam']
      }
    }
  }
} as ComponentMeta<typeof Badge>;

export const Default: BadgeStory = {
  args: {children: 'Licensed', variant: 'positive'},
  name: 'Default'
};

export const WithIcon: BadgeStory = {
  args: {children: <><CheckmarkCircle /><Text>Licensed</Text></>, variant: 'positive'},
  name: 'With icon'
};

export const WithIconReverseOrder: BadgeStory = {
  args: {children: <><Text>Licensed</Text><CheckmarkCircle /></>, variant: 'positive'},
  name: 'With icon, order reversed'
};

export const IconOnly: BadgeStory = {
  args: {children: <CheckmarkCircle />, variant: 'positive', 'aria-label': 'Licensed'},
  name: 'Icon only'
};

export const Overflow: BadgeStory = {
  args: {children: '24 days left in trial', variant: 'positive', UNSAFE_style: {width: '74px'}}
};
