/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Content, Header} from '@react-spectrum/view';
import {InlineAlert} from '../';
import {Meta} from '@storybook/react';
import React from 'react';
import {SpectrumInlineAlertProps} from '@react-types/inlinealert';

// see https://github.com/storybookjs/storybook/issues/8426#issuecomment-669021940
const StoryFn = ({storyFn}) => storyFn();

const meta: Meta<SpectrumInlineAlertProps> = {
  title: 'InlineAlert',
  component: InlineAlert,
  decorators: [storyFn => <StoryFn storyFn={storyFn} />]
};

export default meta;

export const Default = {
  args: {
    children: (
      <>
        <Header>In-line Alert Header</Header>
        <Content>This is a React Spectrum InlineAlert</Content>
      </>
    )
  }
};

export const Informative = {
  args: {
    variant: 'info',
    children: (
      <>
        <Header>In-Line Alert Informative Header</Header>
        <Content>This is a React Spectrum InlineAlert</Content>
      </>
    )
  }
};

export const Positive = {
  args: {
    variant: 'positive',
    children: (
      <>
        <Header>In-Line Alert Positive Header</Header>
        <Content>This is a React Spectrum InlineAlert</Content>
      </>
    )
  }
};

export const Notice = {
  args: {
    variant: 'notice',
    children: (
      <>
        <Header>In-Line Alert Notice Header</Header>
        <Content>This is a React Spectrum InlineAlert</Content>
      </>
    )
  }
};

export const Negative = {
  args: {
    variant: 'negative',
    children: (
      <>
        <Header>In-Line Alert Negative Header</Header>
        <Content>This is a React Spectrum InlineAlert</Content>
      </>
    )
  }
};

export const LongContent = {
  args: {
    variant: 'info',
    render: (args) => (
      <div style={{width: '300px'}}>
        <InlineAlert {...args}>
          <Header>In-line Alert Header that goes on and on my friend</Header>
          <Content>This is a React Spectrum InlineAlert that started announcing without knowing what it was. This is the inline alert that doesn't end. Yes, it goes on and on, my friend.</Content>
        </InlineAlert>
      </div>
    )
  }
};
