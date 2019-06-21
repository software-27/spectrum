import {action} from '@storybook/addon-actions';
import {Provider} from '../';
import {Button} from '@react-spectrum/button';
import React from 'react';
import {storiesOf} from '@storybook/react';

import customTheme from './custom-theme.css';
import scaleMedium from '@adobe/spectrum-css-temp/vars/spectrum-medium-unique.css';
import scaleLarge from '@adobe/spectrum-css-temp/vars/spectrum-large-unique.css';
const THEME = {
  light: customTheme,
  medium: scaleMedium,
  large: scaleLarge
};

storiesOf('Provider', module)
  .add(
    'colorScheme: dark',
    () => render({colorScheme: 'dark', style: {padding: 50, textAlign: 'center', width: 500}})
  )
  .add(
    'scale: large',
    () => render({scale: 'large'})
  )
  .add(
    'nested color schemes',
    () => (
      <Provider colorScheme="dark" style={{padding: 50, textAlign: 'center', width: 500}}>
        <Button variant="primary">I am a dark button</Button>
        <Provider colorScheme="light" style={{padding: 50, margin: 50, textAlign: 'center'}}>
          <Button variant="primary">I am a light button</Button>
        </Provider>
      </Provider>
    )
  )
  .add(
    'locale: cs-CZ',
    () => render({locale: 'cs-CZ'})
  )
  .add(
    'isQuiet',
    () => render({isQuiet: true})
  )
  .add(
    'isDisabled',
    () => render({isDisabled: true})
  )
  .add(
    'isReadOnly',
    () => render({isReadOnly: true})
  )
  .add(
    'custom theme',
    () => render({theme: THEME})
  );

function render(props = {}) {
  return (
    <Provider {...props}>
      <Button variant="primary">I am a button</Button>
    </Provider>
  );
}
