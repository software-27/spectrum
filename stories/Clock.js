import {action} from '@storybook/addon-actions';
import Clock from '../src/Clock';
import createId from '../src/utils/createId';
import FieldLabel from '../src/FieldLabel';
import React from 'react';
import {storiesOf} from '@storybook/react';

const clockId = createId();

storiesOf('Clock', module)
  .add(
    'Default',
    () => render({value: 'today', 'aria-label': 'Start time'})
  )
  .add(
    'uncontrolled',
    () => render({defaultValue: 'today', 'aria-label': 'Start time'})
  )
  .add(
    'quiet=true',
    () => render({quiet: true, 'aria-label': 'Start time'})
  )
  .add(
    'using aria-labelledby',
    () => render({value: 'today', id: clockId, 'aria-labelledby': clockId + '-label', labelText: 'Start time'}),
    {info: 'Labeling using a FieldLabel with labelFor and id, and aria-labelledby on the Clock ensures that the fieldset is labeled and clicking on the label will focus the hours field.'}
  ).add(
    'AM/PM',
    () => render({defaultValue: 'today', displayFormat: 'hh:mm a'})
  );

function renderClock(props = {}) {
  delete props.labelText;
  return (
    <Clock
      onChange={action('change')}
      {...props} />
  );
}

function render(props = {}) {
  return (<div>
    {props.labelText &&
      (<div>
        <FieldLabel label={props.labelText} id={props['aria-labelledby']} labelFor={props.id} />
        {renderClock(props)}
      </div>) ||
      renderClock(props)
    }</div>);
}
