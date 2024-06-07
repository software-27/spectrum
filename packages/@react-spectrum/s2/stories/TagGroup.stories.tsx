/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Tag, TagGroup, Text, Link, Avatar, Image} from '../src';
import {action} from '@storybook/addon-actions';
import NewIcon from '../s2wf-icons/assets/svg/S2_Icon_New_20_N.svg';
import type {Meta} from '@storybook/react';
import {style} from '../style/spectrum-theme' with {type: 'macro'};

const meta: Meta<typeof TagGroup> = {
  component: TagGroup,
  parameters: {
    layout: 'centered'
  },
  args: {
    onRemove: undefined,
    selectionMode: 'single'
  },
  argTypes: {
    onRemove: {
      control: {type: 'boolean'}
    }
  },
  tags: ['autodocs']
};

export default meta;

export let Example = {
  render: (args: any) => {
    if (args.onRemove) {
      args.onRemove = action('remove');
    }
    return (
      <TagGroup {...args}>
        <Tag>Chocolate</Tag>
        <Tag>Mint</Tag>
        <Tag>Strawberry</Tag>
        <Tag>Vanilla</Tag>
      </TagGroup>
    );
  },
  args: {
    label: 'Ice cream flavor',
    errorMessage: 'You must love ice cream',
    description: 'Pick a flavor'
  }
};

const SRC_URL_1 =
  'https://mir-s3-cdn-cf.behance.net/project_modules/disp/690bc6105945313.5f84bfc9de488.png';

export let Disabled = {
  render: (args: any) => {
    if (args.onRemove) {
      args.onRemove = action('remove');
    }

    return (
      <TagGroup {...args} disabledKeys={new Set(['mint', 'vanilla'])} styles={style({width: 320})}>
        <Tag id="chocolate" textValue="chocolate"><NewIcon /><Text>Chocolate</Text></Tag>
        <Tag id="mint">Mint</Tag>
        <Tag id="strawberry">
          <Avatar alt="default adobe" src={SRC_URL_1} />
          <Text>
            Strawberry
          </Text>
        </Tag>
        <Tag id="vanilla">Vanilla</Tag>
        <Tag id="coffee">
          <Image
            src="https://random.dog/1a0535a6-ca89-4059-9b3a-04a554c0587b.jpg"
            alt="Shiba Inu with glasses" />
          <Text>
            Coffee
          </Text>
        </Tag>
      </TagGroup>
    );
  },
  args: {
    label: 'Ice cream flavor'
  }
};

// TODO: Style for light/dark?
function renderEmptyState() {
  return (
    <span>
      No categories. <Link href="https://react-spectrum.adobe.com/">Click here</Link> to add some.
    </span>
  );
}
export let Empty = {
  render: (args: any) => {
    if (args.onRemove) {
      args.onRemove = action('remove');
    }

    return (
      <TagGroup {...args} renderEmptyState={renderEmptyState} />
    );
  },
  args: {
    label: 'Ice cream flavor'
  }
};

export let Links = {
  render: (args: any) => {
    return (
      <TagGroup {...args} disabledKeys={new Set(['google'])}>
        <Tag id="adobe" href="https://adobe.com">Adobe</Tag>
        <Tag id="google">Google</Tag>
        <Tag id="apple" href="https://apple.com">Apple</Tag>
      </TagGroup>
    );
  },
  args: {
    label: 'Tags as links',
    selectionMode: 'none'
  }
};
