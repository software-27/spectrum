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
import Bell from '@spectrum-icons/workflow/Bell';
import {Button} from '../';
import {Flex} from '@react-spectrum/layout';
import {mergeProps} from '@react-aria/utils';
import React, {ElementType} from 'react';
import {SpectrumButtonProps} from '@react-types/button';
import {storiesOf} from '@storybook/react';
import {Text} from '@react-spectrum/text';
import {Tooltip, TooltipTrigger} from '@react-spectrum/tooltip';

const parameters = {
  args: {
    variant: 'cta'
  },
  argTypes: {
    variant: {
      control: {
        type: 'radio',
        options: ['cta', 'primary', 'secondary', 'negative', 'overBackground']
      }
    }
  }
};

let actions = {
  onPress: action('press'),
  onPressStart: action('pressstart'),
  onPressEnd: action('pressend')
};


storiesOf('Button', module)
  .addParameters({providerSwitcher: {status: 'positive'}, ...parameters})
  .add(
    'default',
    (args) => render(args)
  )
  .add(
    'with icon',
    (args) => renderIconText(args)
  )
  .add(
    'icon only',
    (args) => renderIconOnly(args)
  )
  .add(
    'element: a',
    (args) => render({elementType: 'a', ...args})
  )
  .add(
    'element: a, href: \'//example.com\', target: \'_self\'',
    (args) => render({elementType: 'a', href: '//example.com', target: '_self', ...args})
  )
  .add(
    'element: a, rel: \'noopener noreferrer\'',
    (args) => render({elementType: 'a', href: '//example.com', rel: 'noopener noreferrer', ...args})
  )
  .add(
    'user-select:none on press test',
    () => <Example />,
    {description: {data: 'Pressing and holding on either buttons shouldn\'t trigger text selection on the button labels (wait for buttons to turn red).'}}
  )
  .add(
    'styles to check WHCM support',
    () => renderStyles()
  );

function render<T extends ElementType = 'button'>(props: SpectrumButtonProps<T> = {variant: 'primary'}) {
  let buttonProps = mergeProps(props, actions);

  let buttons = (
    <Flex gap="size-200">
      <Button {...buttonProps}>
        Default
      </Button>
      <Button {...buttonProps} isDisabled>
        Disabled
      </Button>
      {props.variant !== 'cta' && (
        <Button {...buttonProps} isQuiet>
          Quiet
        </Button>
      )}
    </Flex>
  );

  if (props.variant === 'overBackground') {
    return (
      <div style={{backgroundColor: 'rgb(15, 121, 125)', color: 'rgb(15, 121, 125)', padding: '15px 20px', display: 'inline-block'}}>
        {buttons}
      </div>
    );
  }

  return buttons;
}

function renderIconText<T extends ElementType = 'button'>(props: SpectrumButtonProps<T> = {variant: 'primary'}) {
  let buttonProps = mergeProps(props, actions);

  let buttons = (
    <Flex gap="size-200">
      <Button {...buttonProps}>
        <Bell />
        <Text>Default</Text>
      </Button>
      <Button {...buttonProps} isDisabled>
        <Bell />
        <Text>Disabled</Text>
      </Button>
      {props.variant !== 'cta' && (
        <Button {...buttonProps} isQuiet>
          <Bell />
          <Text>Quiet</Text>
        </Button>
      )}
    </Flex>
  );

  if (props.variant === 'overBackground') {
    return (
      <div style={{backgroundColor: 'rgb(15, 121, 125)', color: 'rgb(15, 121, 125)', padding: '15px 20px', display: 'inline-block'}}>
        {buttons}
      </div>
    );
  }

  return buttons;
}

function renderIconOnly<T extends ElementType = 'button'>(props: SpectrumButtonProps<T> = {variant: 'primary'}) {
  let buttonProps = mergeProps(props, actions);

  let buttons = (
    <Flex gap="size-200">
      <TooltipTrigger offset={2}>
        <Button {...buttonProps} aria-label="Notifications">
          <Bell />
        </Button>
        <Tooltip>Notifications</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger offset={2}>
        <Button {...buttonProps} aria-label="Notifications (disabled)" isDisabled>
          <Bell />
        </Button>
        <Tooltip>Notifications</Tooltip>
      </TooltipTrigger>
      {props.variant !== 'cta' && (
        <TooltipTrigger offset={2}>
          <Button {...buttonProps} isQuiet aria-label="Notifications (quiet)">
            <Bell />
          </Button>
          <Tooltip>Notifications</Tooltip>
        </TooltipTrigger>
      )}
    </Flex>
  );

  if (props.variant === 'overBackground') {
    return (
      <div style={{backgroundColor: 'rgb(15, 121, 125)', color: 'rgb(15, 121, 125)', padding: '15px 20px', display: 'inline-block'}}>
        {buttons}
      </div>
    );
  }

  return buttons;
}

function Example() {
  let [show, setShow] = React.useState(false);
  let [show2, setShow2] = React.useState(false);

  return (
    <Flex gap="size-200">
      <Button
        variant="cta"
        UNSAFE_style={show ? undefined : {background: 'red', userSelect: 'text'}}
        onPressStart={() => setTimeout(() => setShow(true), 3000)}>
        Press and hold (overwrite)
      </Button>
      <Button
        variant="cta"
        UNSAFE_style={show2 ? undefined : {background: 'red'}}
        onPressStart={() => setTimeout(() => setShow2(true), 3000)}>
        Press and hold (no overwrite)
      </Button>
    </Flex>
  );
}

function renderStyles<T extends ElementType = 'button'>(props: SpectrumButtonProps<T> = {variant: 'primary'}) {
  return (
    <Flex direction="column" gap="size-200">
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          {...props}
          variant="cta">
          CTA
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          {...props}
          variant="cta">
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          {...props}>
          Primary
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          {...props}>
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          {...props}
          variant="secondary">
          Secondary
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          {...props}
          variant="secondary">
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          {...props}
          variant="negative">
          Warning
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          {...props}
          variant="negative">
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isQuiet
          {...props}>
          Primary Quiet
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          isQuiet
          {...props}>
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isQuiet
          {...props}
          variant="secondary">
          Secondary Quiet
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          isQuiet
          {...props}
          variant="secondary">
          Disabled
        </Button>
      </Flex>
      <Flex gap="size-200">
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isQuiet
          {...props}
          variant="negative">
          Warning Quiet
        </Button>
        <Button
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
          isDisabled
          isQuiet
          {...props}
          variant="negative">
          Disabled
        </Button>
      </Flex>
    </Flex>
  );
}
