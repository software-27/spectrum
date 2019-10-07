import {action} from '@storybook/addon-actions';
import Info from '@spectrum-icons/ui/InfoMedium';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {TextField} from '../';
import Tooltip from '@react/react-spectrum/Tooltip';

storiesOf('TextField', module)
  .add(
    'Default',
    () => render()
  )
  .add(
    'value: Test (controlled)',
    () => render({value: 'Test'})
  )
  .add(
    'defaultValue: Test (uncontrolled)',
    () => render({defaultValue: 'Test'})
  )
  .add(
    'isQuiet: true',
    () => render({isQuiet: true})
  )
  .add(
    'isDisabled: true',
    () => render({isDisabled: true})
  )
  .add(
    'isQuiet, isDisabled',
    () => render({isDisabled: true, isQuiet: true})
  )
  .add(
    'validationState: invalid',
    () => render({validationState: 'invalid'})
  )
  .add(
    'validationState: invalid, validationTooltip',
    () => render({
      validationState: 'invalid', 
      validationTooltip: (
        <Tooltip>
          tooltip
        </Tooltip>
      )
    })
  )
  .add(
    'validationState: valid',
    () => render({validationState: 'valid'})
  )
  .add(
    'isReadOnly: true',
    () => render({isReadOnly: true})
  )
  .add(
    'isRequired: true',
    () => render({isRequired: true})
  )
  .add(
    'autoFocus: true',
    () => render({autoFocus: true})
  )
  .add(
    'icon: Info',
    () => render({icon: <Info />})
  )
  .add(
    'icon: Info, isQuiet',
    () => render({icon: <Info />, isQuiet: true})
  )
  .add(
    'icon: Info, isDisabled',
    () => render({icon: <Info />, isDisabled: true})
  )
  .add(
    'icon: Info, isQuiet, isDisabled',
    () => render({icon: <Info />, isQuiet: true, isDisabled: true})
  )
  .add(
    'icon: Info, validationState: invalid, isQuiet',
    () => render({icon: <Info />, validationState: 'invalid', isQuiet: true})
  );

function render(props = {}) {
  return (
    <TextField
      placeholder="React"
      onChange={action('change')}
      onFocus={action('focus')}
      onBlur={action('blur')}
      {...props} />
  );
}
