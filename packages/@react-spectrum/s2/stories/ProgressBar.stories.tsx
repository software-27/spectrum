import {ProgressBar} from '../src';
import type {Meta} from '@storybook/react';
import {StaticColorDecorator} from './utils';

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  parameters: {
    layout: 'centered'
  },
  decorators: [StaticColorDecorator],
  tags: ['autodocs']
};

export default meta;

export const Example = (args: any) => <ProgressBar {...args} />;

Example.args = {
  label: 'Loading…',
  value: 80
};
